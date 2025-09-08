import 'dotenv/config';
import fs from 'fs';

// Load the configuration from config.json.
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// Centralized configuration for the bot.
// This file consolidates all configurable values, making it easy to manage and modify the bot's behavior.

export default {
  // Discord bot token.
  discordToken: process.env.DISCORD_TOKEN,

  // Application ID for the bot.
  applicationId: process.env.APPLICATION_ID,

  // Guild (server) ID where the bot will operate.
  guildId: process.env.GUILD_ID,

  // Load the rest of the configuration from config.json.
  ...config,
};
