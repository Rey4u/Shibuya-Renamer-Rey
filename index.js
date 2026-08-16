const {
    Client,
    GatewayIntentBits,
    PermissionFlagsBits,
    REST,
    Routes,
    SlashCommandBuilder
} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ================================
// EMOJI CHANNEL
// ================================

const emojiMap = {
    "take-role": "✅",
    "direct-connect": "🔑",
    "redeem-code": "🎁",

    "announcement-server": "📢",
    "server-update": "📢",
    "rp-schedule": "📢",
    "social-media": "📸",
    "logo-fraksi": "📸",
    "logo-server": "📸",
    "link-invite": "🔗",

    "welcome": "📡",
    "leave": "📡",
    "boosts-logs": "🔮",

    "basic-rules": "📕",
    "discord-rules": "📕",

    "faq": "❓",
    "keybind": "❓",

    "student-chat": "💬",
    "public-chat": "💬",
    "kritik-saran-admin": "💬",
    "qna-player-baru": "⁉️",
    "gallery-public": "📸",
    "nobar": "📡",
    "evaluasi": "📡",
    "public-space": "📡",
    "afk": "📡",

    "rules-pendaftaran": "💻",
    "format-pendaftaran": "💻",
    "pendaftaran-siswa": "💻",
    "kelas-1-list": "🎓",
    "kelas-2-list": "🎓",
    "kelas-3-list": "🎓",

    "on-streaming": "🔴",
    "share-content": "🎥",

    "report-player": "❌",
    "format-report": "❌",
    "open-ticket": "🎟️",

    "information-donation": "💰",
    "rules-donation": "💰",
    "catalog-donation": "💰",

    "discord-moderation-update": "🛡️",
    "staff-chat": "🛡️",
    "moderator-only": "🛡️",
    "ticket-logs": "🛡️",
    "donation-transfer": "💰",
    "ai-shibuya": "🤖",
    "list-codeblock-discord": "📋",
    "private-channel": "🔒",
    "interview": "🎙️",

    "mading-sekolah-1": "☠️",
    "mading-sekolah-2": "☠️",

    "information": "📢",
    "gang-activity": "📢",
    "chat-fraksi": "💬",
    "req-role-fraksi": "🔒",
    "req-unrole-fraksi": "🔒",

    "shishitoren": "🏴",
    "brahman": "🏴",
    "black-dragon": "🏴",
    "tenjiku": "🏴",
    "kanto-manji": "🏴",
    "oya-koukou": "🏴",
    "kurohebi": "🏴"
};

// ================================
// SLASH COMMAND
// ================================

const command = new SlashCommandBuilder()
    .setName("rapihin")
    .setDescription("Merapikan nama channel Discord")
    .setDefaultMemberPermissions(
        PermissionFlagsBits.ManageChannels
    );

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(
                CLIENT_ID,
                GUILD_ID
            ),
            {
                body: [command.toJSON()]
            }
        );

        console.log("Command /rapihin berhasil didaftarkan.");
    } catch (error) {
        console.error(error);
    }
})();

// ================================
// BOT ONLINE
// ================================

client.once("ready", () => {
    console.log(`Bot online sebagai ${client.user.tag}`);
});

// ================================
// COMMAND /RAPIHIN
// ================================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName !== "rapihin") return;

    if (
        !interaction.memberPermissions.has(
            PermissionFlagsBits.ManageChannels
        )
    ) {
        return interaction.reply({
            content: "❌ Kamu tidak memiliki permission Manage Channels.",
            ephemeral: true
        });
    }

    await interaction.reply({
        content: "⏳ Sedang merapikan channel...",
        ephemeral: true
    });

    let berhasil = 0;
    let dilewati = 0;

    for (const channel of interaction.guild.channels.cache.values()) {

        if (!channel.setName) {
            dilewati++;
            continue;
        }

        let nama = channel.name.toLowerCase();

        // Menghapus emoji + • dari nama lama
        nama = nama
            .replace(/^[^\w]+•\s*/u, "")
            .trim();

        const emoji = emojiMap[nama];

        if (!emoji) {
            dilewati++;
            continue;
        }

        const namaBaru = `${emoji} • ${nama}`;

        if (channel.name === namaBaru) {
            dilewati++;
            continue;
        }

        try {
            await channel.setName(
                namaBaru,
                "Shibuya Renamer"
            );

            berhasil++;

            await new Promise(resolve =>
                setTimeout(resolve, 700)
            );

        } catch (error) {
            console.log(
                `Gagal rename ${channel.name}:`,
                error.message
            );
        }
    }

    await interaction.editReply(
        `✅ **Selesai!**\n\n` +
        `Berhasil: **${berhasil}** channel\n` +
        `Dilewati: **${dilewati}** channel`
    );
});

// ================================
// LOGIN
// ================================

client.login(TOKEN);
