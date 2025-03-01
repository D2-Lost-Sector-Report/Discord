using D2LS_Discord.Discord.Options;
using Discord;
using Microsoft.Extensions.Options;

namespace D2LS_Discord.Discord.Helpers;

public static class Embeds
{
    public const string SectorThumbnail =
        "https://www.bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_7d11acd7d5a3daebc0a0c906452932d6.png";

    public const string NfThumbnail =
        "https://www.bungie.net/common/destiny2_content/icons/48dda413d9f412ca2b10fd56a35a2665.png";

    public static IOptions<DiscordBotOptions> Configuration { get; set; } = null!;

    public static EmbedBuilder MakeBuilder()
    {
        var builder = new EmbedBuilder
        {
            Color = Color.Gold,
            Footer = MakeFooter()
        };

        return builder;
    }

    public static EmbedFooterBuilder MakeFooter()
    {
        return new EmbedFooterBuilder
        {
            Text = "D2LostSector",
            IconUrl = Configuration.Value.Avatar
        };
    }

    public static EmbedBuilder MakeErrorEmbed()
    {
        var builder = new EmbedBuilder
        {
            Color = Color.Red,
            Footer = MakeFooter(),
            ThumbnailUrl = "https://cdn.tryfelicity.one/images/peepoSad.png"
        };

        return builder;
    }
}