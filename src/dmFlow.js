import { Events } from 'discord.js';
import { sessions } from './session.js';
import config from './config.js';
import { askNext } from './session.js';

/**
 * Initializes the DM flow handler for the bot.
 * This function sets up a listener for incoming direct messages and processes them as part of the whitelist application.
 * @param {Client} client The Discord client instance.
 */
export function initializeDmFlow(client) {
  client.on(Events.MessageCreate, async (msg) => {
    // Ignore messages from bots and messages from guilds.
    if (msg.author.bot || msg.guild) return;

    // Fetch partial messages to ensure we have the full content.
    if (msg.partial) { try { await msg.fetch(); } catch {} }

    // Check if the user has an active whitelist session.
    const s = sessions.get(msg.author.id);
    if (!s) return;

    const content = msg.content?.trim();
    if (!content) return;

    // Allow the user to cancel the whitelist process.
    if (content.toLowerCase() === 'cancelar') {
      if (s.timeoutId) clearTimeout(s.timeoutId);
      sessions.delete(msg.author.id);
      await msg.channel.send('❌ Whitelist cancelada. Use `/whitelist` para recomeçar.');
      return;
    }

    // Get the current question.
    const current = config.questions[s.step];
    if (!current) {
      if (s.timeoutId) clearTimeout(s.timeoutId);
      sessions.delete(msg.author.id);
      await msg.channel.send('Erro de sessão. Reinicie com `/whitelist`.');
      return;
    }

    // Store the user's answer and move to the next step.
    s.answers[current.key] = content;
    s.step += 1;
    sessions.set(msg.author.id, s);
    await msg.channel.send('✅ Resposta registrada.');

    // Ask the next question.
    await askNext(msg.author);
  });
}
