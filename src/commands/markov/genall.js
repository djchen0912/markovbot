const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const generateSentence = require('../../utils/generateSentence');
const {ALLOWED_CHANNEL_ID} = require('../../../config.json');

module.exports = {
    name: 'genall',
    description: 'Generate Markov Chain based on all text',
    //devOnly: true,
    //testOnly: Boolean,
    
    //deleted: false,

    callback: (client, interaction) => {
        
        //var sentence = '';
        if(interaction.channel.id !== ALLOWED_CHANNEL_ID){
            interaction.reply({content: 'This command cannot be used in this channel.', ephemeral: true});
            return;
        } else {
            generateSentence.all()
            .then(result => {
                //console.log(result);

                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: 'Fake Name',
                    })
                    .setDescription(result)
                    .setColor('#0097f5');
        
                interaction.reply({ embeds: [embed] });
            })
            .catch(error => {
                interaction.reply({content: 'WRONG USER ID STOP TRYING TO BREAK ME', ephemeral: true});
                console.error('Error: ', error.message);                 
            })
        }
    },
 };

 function getStringWithCallback(callback) {
    generateSentence()
            .then(result => {
                console.log(result);
                callback(null, result);
            })
            .catch(error => {
                callback(error);
            })
 }