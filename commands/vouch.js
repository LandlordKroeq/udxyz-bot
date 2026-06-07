import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'fs';

export default {
  data: new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Submit a vouch for a service')
    .addStringOption(option =>
      option.setName('cheat')
        .setDescription('Select a cheat')
        .setRequired(true)
        .setAutocomplete(true))
    .addIntegerOption(option =>
      option.setName('rating')
        .setDescription('Star rating')
        .setRequired(true)
        .addChoices(
          { name: '⭐☆☆☆☆ — 1 star', value: 1 },
          { name: '⭐⭐☆☆☆ — 2 stars', value: 2 },
          { name: '⭐⭐⭐☆☆ — 3 stars', value: 3 },
          { name: '⭐⭐⭐⭐☆ — 4 stars', value: 4 },
          { name: '⭐⭐⭐⭐⭐ — 5 stars', value: 5 },
        ))
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Your vouch text/comment')
        .setRequired(true)
        .setMaxLength(1024)),

  async autocomplete(interaction) {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    const focused = interaction.options.getFocused();
    const services = config.services.map(s => s.name);
    const filtered = services.filter(s =>
      s.toLowerCase().includes(focused.toLowerCase())
    );

    await interaction.respond(
      filtered.slice(0, 25).map(s => ({ name: s, value: s }))
    );
  },

  async execute(interaction) {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    const serviceName = interaction.options.getString('cheat');
    const rating = interaction.options.getInteger('rating');
    const text = interaction.options.getString('text');

    // Check if user has allowed role
    const hasAllowedRole = interaction.member.roles.cache.some(role =>
      config.allowedRoles.includes(role.id)
    );

    if (!hasAllowedRole && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: '❌ You do not have permission to submit vouches.',
        ephemeral: true
      });
    }

    // Validate service exists (case-insensitive)
    const matchedService = config.services.find(s => s.name.toLowerCase() === serviceName?.toLowerCase());
    if (!matchedService) {
      return interaction.reply({
        content: `❌ **${serviceName}** is not a valid cheat. Please select one from the list.`,
        ephemeral: true
      });
    }
    const resolvedServiceName = matchedService.name;

    // Load vouches
    let vouchData = JSON.parse(fs.readFileSync('./vouches.json', 'utf8'));
    const vouchNumber = vouchData.vouches.length + 1;

    // Create stars with empty slots
    const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

    // Color based on rating
    const color = rating >= 4 ? '#57F287' : rating === 3 ? '#FEE75C' : '#ED4245';

    // Format timestamp
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    // User avatar
    const avatarURL = interaction.user.displayAvatarURL({ size: 128 });

    // Create embed
    const embed = new EmbedBuilder()
      .setTitle(`${resolvedServiceName} | Game Tools, Accounts & Currency`)
      .setDescription('~ Trusted by Gamers Worldwide 🌍')
      .setColor(color)
      .setThumbnail(avatarURL)
      .addFields(
        { name: '', value: stars },
        { name: 'Vouch:', value: text },
        { name: 'Vouch N°:', value: `${vouchNumber}`, inline: true },
        { name: 'Vouched by:', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Vouched at:', value: `${date} ${time}`, inline: true }
      )
      .setFooter({ text: `Service provided by ${resolvedServiceName} • ${date} ${time}` })
      .setTimestamp();

    // Send to vouch channel
    const channel = interaction.guild.channels.cache.get(config.vouchChannel);
    if (channel) {
      await channel.send({ embeds: [embed] });
    }

    // Save vouch
    vouchData.vouches.push({
      userId: interaction.user.id,
      service: resolvedServiceName,
      rating,
      text,
      vouchNumber,
      timestamp: Date.now()
    });
    fs.writeFileSync('./vouches.json', JSON.stringify(vouchData, null, 2));

    await interaction.reply({
      content: '✅ Your vouch has been submitted!',
      ephemeral: true
    });
  }
};
