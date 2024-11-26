module.exports = {
    data: {
        name: 'ping',
        description: 'Responde con Pong!',
    },
    run: async (interaction) => {
        await interaction.reply('BIM BOM!');
        await interaction.reply('B0M! BOM!');
    },
};