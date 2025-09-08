import { EmbedBuilder } from 'discord.js';

/**
 * Handles errors that occur during interaction processing.
 * It logs the error and sends a user-friendly message to the user.
 * @param {Error} error The error that occurred.
 * @param {Interaction} interaction The interaction that caused the error.
 */
export function handleError(error, interaction) {
  console.error('Error:', error);

  // If the interaction is still available, reply to the user with an error message.
  if (interaction && interaction.reply) {
    const embed = new EmbedBuilder()
      .setTitle('❌ Erro')
      .setDescription('Ocorreu um erro ao processar sua solicitação. A equipe já foi notificada.')
      .setColor(0xe74c3c)
      .setTimestamp();

    // If the interaction has already been deferred or replied to, use followUp.
    if (interaction.deferred || interaction.replied) {
      interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
}