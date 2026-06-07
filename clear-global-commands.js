import { REST, Routes } from 'discord.js';

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

console.log('Clearing all global commands...');

await rest.put(
  Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
  { body: [] }
);

console.log('✅ All global commands cleared.');
