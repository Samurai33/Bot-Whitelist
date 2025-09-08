import { Client, GatewayIntentBits, Partials, Events, Collection, SlashCommandBuilder } from 'discord.js';
import config from './config.js';
import { initializeInteractionHandler } from './interactions.js';
import { initializeDmFlow } from './dmFlow.js';
import { initializeSessionManager } from './session.js';
import { initializeHelpers } from './helpers.js';

// Initialize the Discord client with necessary intents and partials.
// Intents determine which events the bot will receive from Discord.
// Partials allow the bot to receive events for uncached entities.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User]
});

// Initialize modules with the client instance (dependency injection).
// This makes the client instance available throughout the application without passing it as a parameter.
initializeSessionManager(client);
initializeHelpers(client);

// This event is triggered when the bot successfully logs in.
client.once(Events.ClientReady, async () => {
  console.log(`✅ Logado como ${client.user.tag}`);

  // Fetch the guild from the configuration to register slash commands.
  // This ensures that the commands are only registered in the specified guild.
  const guild = config.guildId ? await client.guilds.fetch(config.guildId).catch(() => null) : null;
  if (guild) {
    await guild.commands.set([
      new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Iniciar whitelist por DM (perguntas uma a uma)')
        .toJSON(),
      new SlashCommandBuilder()
        .setName('whitelist_modal')
        .setDescription('Iniciar whitelist via Modal (sem DM)')
        .toJSON()
    ]);
    console.log('⚙️ Comandos garantidos no GUILD.');
  }
});

// Initialize the interaction and DM flow handlers.
// These handlers listen for and process user interactions and messages.
initializeInteractionHandler(client);
initializeDmFlow(client);

// Log in to Discord with the bot's token.
client.login(config.discordToken);