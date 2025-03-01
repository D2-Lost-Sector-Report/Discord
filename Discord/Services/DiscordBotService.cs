using System.Diagnostics;
using System.Reflection;
using D2LS_Discord.Discord.Helpers;
using D2LS_Discord.Discord.Options;
using Discord;
using Discord.Commands;
using Discord.Interactions;
using Discord.WebSocket;
using Microsoft.Extensions.Options;
using Serilog;

namespace D2LS_Discord.Discord.Services;

public class DiscordStartupService : BackgroundService
{
    private readonly LogAdapter<BaseSocketClient> _adapter;
    private readonly CommandService _commandService;
    private readonly IOptions<DiscordBotOptions> _discordBotOptions;
    private readonly DiscordShardedClient _discordShardedClient;
    private readonly InteractionService _interactionService;
    private readonly ILogger<DiscordStartupService> _logger;
    private readonly IServiceProvider _serviceProvider;

    private int _shardsReady;
    private TaskCompletionSource<bool>? _taskCompletionSource;

    public DiscordStartupService(
        DiscordShardedClient discordShardedClient,
        IOptions<DiscordBotOptions> discordBotOptions,
        InteractionService interactionService,
        CommandService commandService,
        IServiceProvider serviceProvider,
        LogAdapter<BaseSocketClient> adapter,
        ILogger<DiscordStartupService> logger)
    {
        _discordShardedClient = discordShardedClient;
        _discordBotOptions = discordBotOptions;
        _interactionService = interactionService;
        _commandService = commandService;
        _serviceProvider = serviceProvider;
        _adapter = adapter;
        _logger = logger;

        Embeds.Configuration = _discordBotOptions;
    }

    public static int ServerCount { get; private set; }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            _discordShardedClient.Log += _adapter.Log;
            _discordShardedClient.ShardDisconnected += OnShardDisconnected;

            _discordShardedClient.MessageReceived += OnMessageReceived;

            _discordShardedClient.JoinedGuild += OnJoinedGuild;
            _discordShardedClient.LeftGuild += OnLeftGuild;

            _discordShardedClient.InteractionCreated += OnInteractionCreated;
            _interactionService.SlashCommandExecuted += OnSlashCommandExecuted;

            PrepareClientAwaiter();
            await _discordShardedClient.LoginAsync(TokenType.Bot, _discordBotOptions.Value.Token);
            await _discordShardedClient.StartAsync();

            await WaitForReadyAsync(stoppingToken);

            ServerCount = _discordShardedClient.Guilds.Count;

            await _commandService.AddModulesAsync(Assembly.GetEntryAssembly(), _serviceProvider);
            await _interactionService.AddModulesAsync(Assembly.GetEntryAssembly(), _serviceProvider);

            await _interactionService.RegisterCommandsGloballyAsync();

            if (Debugger.IsAttached)
            {
                await _discordShardedClient.Rest.DeleteAllGlobalCommandsAsync();
                await _interactionService.RegisterCommandsToGuildAsync(906471158684217374);
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Exception in DiscordStartupService");
        }
    }

    private void PrepareClientAwaiter()
    {
        _taskCompletionSource = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);
        _shardsReady = 0;

        _discordShardedClient.ShardReady += OnShardReady;
    }

    private Task WaitForReadyAsync(CancellationToken cancellationToken)
    {
        if (_taskCompletionSource is null)
            throw new InvalidOperationException(
                "The sharded client has not been registered correctly. Did you use ConfigureDiscordShardedHost on your HostBuilder?");

        if (_taskCompletionSource.Task.IsCompleted)
            return _taskCompletionSource.Task;

        var registration = cancellationToken.Register(
            state => { ((TaskCompletionSource<bool>)state!).TrySetResult(true); },
            _taskCompletionSource);

        return _taskCompletionSource.Task.ContinueWith(_ => registration.DisposeAsync(), cancellationToken);
    }

    private Task OnShardReady(DiscordSocketClient discordClient)
    {
        Log.Information(
            $"Connected as {discordClient.CurrentUser.Username}#{discordClient.CurrentUser.DiscriminatorValue}");

        _shardsReady++;

        if (_shardsReady != _discordShardedClient.Shards.Count)
            return Task.CompletedTask;

        _taskCompletionSource!.TrySetResult(true);
        _discordShardedClient.ShardReady -= OnShardReady;

        return Task.CompletedTask;
    }

    private static async Task OnShardDisconnected(Exception arg1, DiscordSocketClient arg2)
    {
        Log.Error(arg1, "Disconnected from gateway.");

        if (arg1.InnerException is GatewayReconnectException &&
            arg1.InnerException.Message == "Server missed last heartbeat")
        {
            await arg2.StopAsync();
            await Task.Delay(10000);
            await arg2.StartAsync();
        }
    }
}