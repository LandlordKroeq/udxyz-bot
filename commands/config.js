import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

function saveConfig(config) {
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

export default {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure the vouch system (Owner only)')
    .addSubcommand(sub =>
      sub.setName('add-service')
        .setDescription('Add a service')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Service name')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('remove-service')
        .setDescription('Remove a service')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Service name')
            .setRequired(true)
            .setAutocomplete(true)))
    .addSubcommand(sub =>
      sub.setName('add-role')
        .setDescription('Add a role allowed to vouch')
        .addRoleOption(opt =>
          opt.setName('role')
            .setDescription('Role')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('remove-role')
        .setDescription('Remove a vouch-allowed role')
        .addRoleOption(opt =>
          opt.setName('role')
            .setDescription('Role')
            .setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('set-channel')
        .setDescription('Set the vouch output channel')
        .addChannelOption(opt =>
          opt.setName('channel')
            .setDescription('Channel')
            .setRequired(true))),

  async autocomplete(interaction) {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    const focused = interaction.options.getFocused();
    const services = config.services.map(s => s.name);
    const filtered = services.filter(s =>
      s.toLowerCase().startsWith(focused.toLowerCase())
    );

    await interaction.respond(
      filtered.slice(0, 25).map(s => ({ name: s, value: s }))
    );
  },

  async execute(interaction) {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    // Check if owner
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: '❌ Only the server owner can use this command.',
        ephemeral: true
      });
    }

    const sub = interaction.options.getSubcommand();

    if (sub === 'add-service') {
      const name = interaction.options.getString('name');
      if (config.services.some(s => s.name === name)) {
        return interaction.reply({ content: `⚠️ Service **${name}** already exists.`, ephemeral: true });
      }
      config.services.push({ name });
      saveConfig(config);
      return interaction.reply({ content: `✅ Added service **${name}**.`, ephemeral: true });
    }

    if (sub === 'remove-service') {
      const name = interaction.options.getString('name');
      config.services = config.services.filter(s => s.name !== name);
      saveConfig(config);
      return interaction.reply({ content: `✅ Removed service **${name}**.`, ephemeral: true });
    }

    if (sub === 'add-role') {
      const role = interaction.options.getRole('role');
      if (config.allowedRoles.includes(role.id)) {
        return interaction.reply({ content: `⚠️ Role **${role.name}** is already allowed.`, ephemeral: true });
      }
      config.allowedRoles.push(role.id);
      saveConfig(config);
      return interaction.reply({ content: `✅ Added allowed role **${role.name}**.`, ephemeral: true });
    }

    if (sub === 'remove-role') {
      const role = interaction.options.getRole('role');
      config.allowedRoles = config.allowedRoles.filter(r => r !== role.id);
      saveConfig(config);
      return interaction.reply({ content: `✅ Removed allowed role **${role.name}**.`, ephemeral: true });
    }

    if (sub === 'set-channel') {
      const channel = interaction.options.getChannel('channel');
      config.vouchChannel = channel.id;
      saveConfig(config);
      return interaction.reply({ content: `✅ Vouch channel set to <#${channel.id}>.`, ephemeral: true });
    }
  }
};
