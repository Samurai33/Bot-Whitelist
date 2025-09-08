import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import config from './src/config.js';

const commands = [
  new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Iniciar whitelist por DM (perguntas uma a uma)')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('whitelist_modal')
    .setDescription('Iniciar whitelist via Modal (sem DM)')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(config.discordToken);

async function main() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(config.applicationId, config.guildId),
      { body: commands }
    );
    console.log('✅ Comando /whitelist registrado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comando:', error);
  }
}

main();