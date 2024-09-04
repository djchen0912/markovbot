const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const generateSentence = require('../../utils/generateSentence');
const {ALLOWED_CHANNEL_ID} = require('../../../config.json');

module.exports = {
    name: 'gen',
    description: 'Generate Markov Chain based on user',
    //devOnly: true,
    //testOnly: Boolean,    
    //deleted: false,

    options: [
        {
            name: 'target-user',
            description: 'User to generate chains from',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        }
    ],

    callback: (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;

        if(interaction.channel.id !== ALLOWED_CHANNEL_ID){
            interaction.reply({content: 'This command cannot be used in this channel.', ephemeral: true});
            return;
        } else {
            generateSentence.user(targetUserId)
            .then(result => {
                const embed = new EmbedBuilder()
                    .setDescription("𝑭𝒂𝒌𝒆 " + '<@' + targetUserId + '>')
                    .addFields(
                    {
                        name: "Generated",
                        value: result,
                        inline: false
                    },
                    )
                    .setColor("#00b0f4");
        
                interaction.reply({ embeds: [embed] });
            })
            .catch(error => {
                console.error('Error: ', error.message);
            })
        }
    },
 };