import { Events, InteractionType, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } from 'discord.js';
import config from './config.js';
import { sessions, cooldowns, startPerQuestionTimer, userInCooldown, askNext } from './session.js';
import { buildStaffEmbed, buildButtons, getStaffChannelOrWarn, getNotifyChannelOrNull, buildDecisionEmbed } from './helpers.js';
import { customIds } from './constants.js';
import { handleError } from './errors.js';

/**
 * Initializes the interaction handler for the bot.
 * This function sets up a listener for all incoming interactions (slash commands, buttons, modals)
 * and routes them to the appropriate handler.
 * @param {Client} client The Discord client instance.
 */
export function initializeInteractionHandler(client) {
  client.on(Events.InteractionCreate, async (interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        await handleChatInputCommand(interaction);
      } else if (interaction.type === InteractionType.ModalSubmit) {
        await handleModalSubmit(interaction);
      } else if (interaction.isButton()) {
        await handleButton(interaction);
      }
    } catch (err) {
      handleError(err, interaction);
    }
  });
}

/**
 * Handles incoming slash command interactions.
 * @param {ChatInputCommandInteraction} interaction The interaction object.
 */
async function handleChatInputCommand(interaction) {
  const { commandName, user } = interaction;

  if (commandName === 'whitelist') {
    // Check if the user is on cooldown.
    if (userInCooldown(user.id)) {
      const remain = Math.ceil((config.timeouts.cooldown - (Date.now() - cooldowns.get(user.id))) / 60000);
      return interaction.reply({ content: `⏳ Aguarde ${remain} min para tentar novamente.`, flags: MessageFlags.Ephemeral });
    }

    // Check if the user already has an active session.
    if (sessions.has(user.id)) {
      return interaction.reply({ content: '⚠️ Você já tem uma whitelist em andamento. Verifique sua DM ou envie `cancelar`.', flags: MessageFlags.Ephemeral });
    }

    // Start a new whitelist session.
    sessions.set(user.id, { step: 0, answers: {}, guildId: interaction.guildId, timeoutId: null });
    try {
      const dm = await user.createDM();
      await dm.send('Olá! Vamos iniciar sua **whitelist**. Responda cada pergunta em uma mensagem. Para cancelar, envie `cancelar`.');
      await askNext(user);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Ir para a DM')
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/channels/@me/${dm.id}`)
      );

      await interaction.reply({ content: 'Te chamei no DM. Responda por lá ✅', components: [row], flags: MessageFlags.Ephemeral });
    } catch {
      // If the bot can't send a DM, inform the user and delete the session.
      sessions.delete(user.id);
      await interaction.reply({ content: '❌ Não consegui enviar DM. Ative DMs ou use `/whitelist_modal`.', flags: MessageFlags.Ephemeral });
    }
  } else if (commandName === 'whitelist_modal') {
    // Similar checks for the modal-based whitelist.
    if (userInCooldown(user.id)) {
      const remain = Math.ceil((config.timeouts.cooldown - (Date.now() - cooldowns.get(user.id))) / 60000);
      return interaction.reply({ content: `⏳ Aguarde ${remain} min para tentar novamente.`, flags: MessageFlags.Ephemeral });
    }

    // Create and show the whitelist modal.
    const modal = new ModalBuilder()
      .setCustomId(`${customIds.whitelistModal}:${user.id}`)
      .setTitle('Whitelist - Marola RP');
    
    // Add text inputs for each question.
    const inputs = config.questions.map((q, i) => 
      new TextInputBuilder()
        .setCustomId(q.key)
        .setLabel(q.q)
        .setStyle(i < 2 ? TextInputStyle.Short : TextInputStyle.Paragraph)
        .setRequired(true)
    );

    // The modal can only have 5 components, so we need to combine some questions if there are more than 5.
    // This is a limitation of the Discord API.
    const i1 = new TextInputBuilder().setCustomId('nome').setLabel('Nome completo').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100).setPlaceholder(config.questions[0].q);
    const i2 = new TextInputBuilder().setCustomId('idade').setLabel('Idade').setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(3).setPlaceholder(config.questions[1].q);
    const i3 = new TextInputBuilder().setCustomId('experiencia').setLabel('Experiência').setStyle(TextInputStyle.Paragraph).setRequired(true).setPlaceholder(config.questions[2].q);
    const i4 = new TextInputBuilder().setCustomId('amor_vida').setLabel('Amor à Vida').setStyle(TextInputStyle.Paragraph).setRequired(true).setPlaceholder(config.questions[3].q);
    const i5 = new TextInputBuilder().setCustomId('meta_rdm').setLabel('Metagaming e RDM').setStyle(TextInputStyle.Paragraph).setRequired(true).setPlaceholder('Explique METAGAMING e RDM em um só texto.');
    modal.addComponents(
      { type: 1, components: [i1] },
      { type: 1, components: [i2] },
      { type: 1, components: [i3] },
      { type: 1, components: [i4] },
      { type: 1, components: [i5] }
    );
    await interaction.showModal(modal);
  }
}

/**
 * Handles incoming modal submission interactions.
 * @param {ModalSubmitInteraction} interaction The interaction object.
 */
async function handleModalSubmit(interaction) {
  const { customId, client } = interaction;

  if (customId.startsWith(customIds.whitelistModal)) {
    // Process the whitelist application from the modal.
    const userId = customId.split(':')[1];
    const answers = {
      nome: interaction.fields.getTextInputValue('nome'),
      idade: interaction.fields.getTextInputValue('idade'),
      experiencia: interaction.fields.getTextInputValue('experiencia'),
      amor_vida: interaction.fields.getTextInputValue('amor_vida'),
      metagaming: interaction.fields.getTextInputValue('meta_rdm'),
      rdm: interaction.fields.getTextInputValue('meta_rdm'),
    };
    const user = await client.users.fetch(userId).catch(() => interaction.user);
    const channel = await getStaffChannelOrWarn(user);
    if (channel) {
      const embed = buildStaffEmbed(user, answers, 'MODAL');
      const base = `wl:${userId}`;
      await channel.send({ embeds: [embed], components: [buildButtons(base)] });
    }
    cooldowns.set(userId, Date.now());
    await interaction.reply({ content: '✅ Sua whitelist foi enviada para revisão!', flags: MessageFlags.Ephemeral });
  } else if (customId.startsWith(customIds.rejectModal)) {
    // Process the rejection reason from the modal.
    const [, targetUserId, msgId] = customId.split(':');
    const reason = interaction.fields.getTextInputValue('reason')?.trim() || 'Sem motivo informado';

    // Edit the original message to show the rejection reason.
    const channel = await client.channels.fetch(interaction.channelId);
    const original = await channel.messages.fetch(msgId).catch(() => null);
    if (original) {
      const newEmbed = EmbedBuilder.from(original.embeds?.[0] ?? new EmbedBuilder())
        .setColor(0xe74c3c)
        .setTitle('Whitelist - REPROVADA')
        .setFooter({ text: `Reprovada por ${interaction.user.tag}` })
        .setTimestamp();

      await original.edit({
        content: `❌ Reprovado por ${interaction.user.tag}\n**Motivo:** ${reason}`,
        embeds: [newEmbed],
        components: []
      });
    }

    // Send a DM to the user with the rejection reason.
    const member = await interaction.guild.members.fetch(targetUserId).catch(() => null);
    await member?.send(`Sua whitelist foi **REPROVADA**.\nMotivo: ${reason}`);

    // Send a notification to the rejected channel.
    const notifyCh = await getNotifyChannelOrNull(config.channels.rejectedNotify, 'reprovados');
    if (notifyCh) {
      const emb = buildDecisionEmbed({
        type: 'reject',
        targetUserId: targetUserId,
        moderatorTag: interaction.user.tag,
        reason
      });
      await notifyCh.send({ embeds: [emb] });
    }

    await interaction.reply({ content: '❌ Reprovação registrada e notificada.', flags: MessageFlags.Ephemeral });
  }
}

/**
 * Handles incoming button interactions.
 * @param {ButtonInteraction} interaction The interaction object.
 */
async function handleButton(interaction) {
  const [prefix, userId, action] = interaction.customId.split(':');
  if (prefix !== 'wl') return;

  // Check if the user has the required permissions to approve/reject.
  const moderator = await interaction.guild.members.fetch(interaction.user.id);
  if (!moderator.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return interaction.reply({ content: 'Sem permissão.', flags: MessageFlags.Ephemeral });
  }

  const member = await interaction.guild.members.fetch(userId).catch(() => null);
  if (!member) {
    return interaction.reply({ content: 'Usuário não está no servidor.', flags: MessageFlags.Ephemeral });
  }

  if (action === 'approve') {
    // Approve the user.
    if (config.roles.approved) await member.roles.add(config.roles.approved);
    if (config.roles.visitor) await member.roles.remove(config.roles.visitor);
    await interaction.update({ content: `✅ Aprovado por ${interaction.user.tag}`, components: [] });
    await member.send('🎉 Você foi **APROVADO** na whitelist do Marola RP!');

    // Send a notification to the approved channel.
    const notifyCh = await getNotifyChannelOrNull(config.channels.approvedNotify, 'aprovados');
    if (notifyCh) {
      const emb = buildDecisionEmbed({ type: 'approve', targetUserId: userId, moderatorTag: interaction.user.tag });
      await notifyCh.send({ embeds: [emb] });
    }
  } else if (action === 'reject') {
    // Show a modal to get the rejection reason.
    const modal = new ModalBuilder()
      .setCustomId(`${customIds.rejectModal}:${userId}:${interaction.message.id}`)
      .setTitle('Reprovar whitelist');

    const reason = new TextInputBuilder()
      .setCustomId('reason')
      .setLabel('Motivo da reprovação')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(500)
      .setPlaceholder('Explique por que está reprovando (ex.: metagaming incorreto, RDM mal explicado, etc.)');

    modal.addComponents({ type: 1, components: [reason] });
    return interaction.showModal(modal);
  }
}