import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } from 'discord.js';
import config from './config.js';
import { customIds } from './constants.js';

// The Discord client instance, initialized via dependency injection.
let clientInstance;

/**
 * Initializes the helpers with the Discord client instance.
 * @param {Client} client The Discord client instance.
 */
export function initializeHelpers(client) {
  clientInstance = client;
}

/**
 * Builds an embed for a new whitelist application.
 * @param {User} user The user who applied.
 * @param {object} answers The user's answers to the questions.
 * @param {string} source The source of the application (DM or MODAL).
 * @returns {EmbedBuilder} The constructed embed.
 */
export function buildStaffEmbed(user, answers, source = 'DM') {
  const emb = new EmbedBuilder()
    .setTitle('Whitelist - Novo Pedido')
    .setDescription(`Candidato: <@${user.id}>
Origem: **${source}**`)
    .setColor(0x2ecc71)
    .setTimestamp()
    .setFooter({ text: `UserID: ${user.id}` });

  for (const q of config.questions) {
    emb.addFields({ name: q.q, value: String(answers[q.key] ?? '—') });
  }
  return emb;
}

/**
 * Builds the action row with approve and reject buttons.
 * @param {string} base The base custom ID for the buttons.
 * @returns {ActionRowBuilder} The constructed action row.
 */
export function buildButtons(base) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`${base}:${customIds.approveButton.split(':')[1]}`).setLabel('Aprovar').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`${base}:${customIds.rejectButton.split(':')[1]}`).setLabel('Reprovar').setStyle(ButtonStyle.Danger)
  );
}

/**
 * Fetches the staff review channel and checks for necessary permissions.
 * If the channel is not found or permissions are missing, it warns the user.
 * @param {User} user The user who applied.
 * @returns {Promise<TextChannel|null>} The staff review channel or null if not found or permissions are missing.
 */
export async function getStaffChannelOrWarn(user) {
  try {
    const channel = await clientInstance.channels.fetch(config.channels.staffReview);
    if (!channel) throw new Error('Canal não encontrado');

    const me = await channel.guild.members.fetch(clientInstance.user.id);
    const perms = channel.permissionsFor(me);
    const need = [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.EmbedLinks
    ];
    if (!perms || !need.every(p => perms.has(p))) {
      throw new Error('Permissões insuficientes no canal da staff');
    }
    return channel;
  } catch (err) {
    console.warn('[WL] Problema no canal staff:', err.message);
    try {
      await user.send('⚠️ Suas respostas foram coletadas, mas não consegui postar no canal da staff. Avise um administrador para corrigir as permissões.');
    } catch {} 
    return null;
  }
}

/**
 * Fetches a notification channel and checks for necessary permissions.
 * @param {string} channelId The ID of the channel to fetch.
 * @param {string} label A label for the channel for logging purposes.
 * @returns {Promise<TextChannel|null>} The notification channel or null if not found or permissions are missing.
 */
export async function getNotifyChannelOrNull(channelId, label) {
  if (!channelId) {
    console.warn(`[WL] Canal de notificação (${label}) não configurado.`);
    return null;
  }
  try {
    const channel = await clientInstance.channels.fetch(channelId);
    if (!channel) {
      console.warn(`[WL] Canal de notificação (${label}) não encontrado: ${channelId}`);
      return null;
    }
    const me = await channel.guild.members.fetch(clientInstance.user.id);
    const perms = channel.permissionsFor(me);
    const need = [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.EmbedLinks
    ];
    if (!perms || !need.every(p => perms.has(p))) {
      console.warn(`[WL] Sem permissão no canal de notificação (${label}).`);
      return null;
    }
    return channel;
  } catch (e) {
    console.warn(`[WL] Erro ao obter canal (${label}):`, e.message);
    return null;
  }
}

/**
 * Builds an embed for the decision of a whitelist application (approved or rejected).
 * @param {object} data The data for the decision embed.
 * @param {string} data.type The type of the decision ('approve' or 'reject').
 * @param {string} data.targetUserId The ID of the user who was approved/rejected.
 * @param {string} data.moderatorTag The tag of the moderator who made the decision.
 * @param {string} [data.reason] The reason for the rejection.
 * @returns {EmbedBuilder} The constructed embed.
 */
export function buildDecisionEmbed({ type, targetUserId, moderatorTag, reason }) {
  const isApprove = type === 'approve';
  const desc = 
    `${isApprove ? '✅' : '❌'} Candidato: <@${targetUserId}>
` +
    `Revisor: **${moderatorTag}**` +
    (!isApprove && reason ? `
Motivo: ${reason}` : '');

  return new EmbedBuilder()
    .setTitle(isApprove ? 'Whitelist Aprovada' : 'Whitelist Reprovada')
    .setDescription(desc)
    .setColor(isApprove ? 0x2ecc71 : 0xe74c3c)
    .setTimestamp();
}