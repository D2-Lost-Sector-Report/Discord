using D2LS_Discord.Core.Helpers;
using D2LS_Discord.Discord.Helpers;
using D2LS_Discord.Discord.Services;
using Discord;
using Discord.WebSocket;
using Serilog;
using Serilog.Events;

namespace D2LS_Discord
{
    public static class Program
    {
        public static async Task Main()
        {
            FileOperations.EnsureDirectoryExists("Config");
            FileOperations.EnsureDirectoryExists("Data");
            FileOperations.EnsureDirectoryExists("Logs");

            Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Quartz", LogEventLevel.Information)
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .WriteTo.Console()
                .WriteTo.File("Logs/latest-.log",
                    rollingInterval: RollingInterval.Day,
                    retainedFileCountLimit: 14,
                    restrictedToMinimumLevel: LogEventLevel.Information)
                .CreateLogger();

            try
            {
                var builder = WebApplication.CreateBuilder();
                builder.Services.AddAuthorization();

                builder.Services
                    .AddDiscord(
                        discordClient =>
                        {
                            discordClient.GatewayIntents =
                                GatewayIntents.AllUnprivileged & ~GatewayIntents.GuildInvites &
                                ~GatewayIntents.GuildScheduledEvents;
                            discordClient.AlwaysDownloadUsers = false;
                        },
                        _ => { },
                        textCommandsService => { textCommandsService.CaseSensitiveCommands = false; },
                        builder.Configuration)
                    .AddLogging(options => options.AddSerilog(dispose: true))
                    .AddHostedService<JobService>()
                    .AddSingleton<LogAdapter<BaseSocketClient>>();

                var app = builder.Build();
                app.UseAuthorization();
                app.MapGet("/health", () => Results.Ok());
                app.MapGet("/server-count", () => Results.Ok(DiscordStartupService.ServerCount));

                await app.RunAsync();
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Host terminated unexpectedly");
            }
            finally
            {
                await Log.CloseAndFlushAsync();
            }
        }
    }
}