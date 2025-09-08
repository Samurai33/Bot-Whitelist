import { Collection } from 'discord.js';
import config from './config.js';
import { getStaffChannelOrWarn, buildStaffEmbed, buildButtons } from './helpers.js';

// Collections to store active whitelist sessions and user cooldowns.
// Using Collections provides useful methods for managing the data.
export const sessions = new Collection();
export const cooldowns = new Collection();

// The Discord client instance, initialized via dependency injection.
let clientInstance;

/**
 * Initializes the session manager with the Discord client instance.
 * @param {Client} client The Discord client instance.
 */
export function initializeSessionManager(client) {
  clientInstance = client;
}

/**
 * Starts a timer for each question in the whitelist process.
 * If the user doesn't answer in time, the session is terminated.
 * @param {string} userId The ID of the user.
 */
export function startPerQuestionTimer(userId) {
  const s = sessions.get(userId);
  if (!s) return;
  if (s.timeoutId) clearTimeout(s.timeoutId);

  const timeoutId = setTimeout(async () => {
    sessions.delete(userId);
    try {
      const user = await clientInstance.users.fetch(userId);
      await user.send('⏰ Tempo esgotado para responder. Use `/whitelist` novamente para recomeçar.');
    } catch {}
  }, config.timeouts.perQuestion);

  s.timeoutId = timeoutId;
  sessions.set(userId, s);
}

/**
 * Asks the next question in the whitelist process or ends the session if all questions have been answered.
 * @param {User} user The user to ask the next question to.
 */
export async function askNext(user) {
  const s = sessions.get(user.id);
  if (!s) return;

  // If all questions have been answered, send the application to the staff channel.
  if (s.step >= config.questions.length) {
    const channel = await getStaffChannelOrWarn(user);
    if (channel) {
      const embed = buildStaffEmbed(user, s.answers, 'DM');
      const base = `wl:${user.id}`;
      await channel.send({ embeds: [embed], components: [buildButtons(base)] });
    }
    cooldowns.set(user.id, Date.now());
    if (s.timeoutId) clearTimeout(s.timeoutId);
    sessions.delete(user.id);
    try { await user.send('✅ Recebemos suas respostas. A staff irá revisar.'); } catch {}
    return;
  }

  // Ask the next question.
  const current = config.questions[s.step];
  try {
    const dm = await user.createDM();
    await dm.send(`**Pergunta ${s.step + 1}/${config.questions.length}:** ${current.q}`);
    startPerQuestionTimer(user.id);
  } catch {
    // If the bot can't send a DM, terminate the session.
    if (s.timeoutId) clearTimeout(s.timeoutId);
    sessions.delete(user.id);
  }
}

/**
 * Checks if a user is on cooldown.
 * @param {string} userId The ID of the user to check.
 * @returns {boolean} Whether the user is on cooldown.
 */
export function userInCooldown(userId) {
  const last = cooldowns.get(userId) || 0;
  return Date.now() - last < config.timeouts.cooldown;
}
