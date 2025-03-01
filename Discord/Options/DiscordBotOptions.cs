using Discord;

namespace D2LS_Discord.Discord.Options;

public class DiscordBotOptions
{
    public string? Token { get; set; }
    public string? Prefix { get; set; }
    public ulong LogServerId { get; set; }
    public ulong[]? BotStaff { get; set; }
    public ulong[]? BannedUsers { get; set; }
    public string? Avatar { get; set; } = "";
    public ulong ManagementChannel { get; set; } = 1085221620253216769;
    public ulong SectorChannel { get; set; } = 975777471704223774;
    public ulong NightfallChannel { get; set; } = 1069421714917838918;
    public string? AutoPostCronJob { get; set; } = "0 0 18 ? * * *";

    // TODO: Add streaming status indicator
    public string? TwitchClientId { get; set; }
    public string? TwitchAuth { get; set; }

    public Func<LogMessage, Exception?, string> LogFormat { get; set; } =
        (message, _) => $"{message.Source}: {message.Message}";
}