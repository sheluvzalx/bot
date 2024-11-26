const { Client, version, GatewayIntentBits } = require('discord.js');
const { token, prefix } = require('./config.json');
const fs = require('fs');
const path = require('path');

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildInvites,
    ],
});

console.log('Cargando Bot');
console.log('Versión de discord.js:', version);

bot.once('ready', () => {
    console.log(`${bot.user.username} listo`);
});

bot.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    bot.commands.set(command.data.name, command);
}

bot.once('ready', async () => {
    console.log('Comandos listos 👾');
    console.log('Comandos registrados:', Array.from(bot.commands.keys()));

    try {
        await bot.application.commands.set(
            Array.from(bot.commands.values()).map(cmd => cmd.data)
        );
        console.log('Comandos registrados correctamente en Discord');
    } catch (error) {
        console.error('Error al registrar los comandos:', error);
    }
});

bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    console.log('Comando recibido:', interaction.commandName);

    const command = bot.commands.get(interaction.commandName);
    if (!command) {
        console.error('Comando no encontrado:', interaction.commandName);
        return;
    }

    try {
        await command.run(interaction);
    } catch (error) {
        console.error('Error al ejecutar el comando:', error);
        await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true });
    }
});

bot.login(token);
