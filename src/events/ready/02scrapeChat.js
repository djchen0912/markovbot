//const { dirname } = require('path');
const {readableChannels} = require('../../../config.json');
const {chatScrape} = require('../../../config.json');
const {databaseName} = require('../../../config.json');
const parseAllChannelMessages = require('../../utils/parseAllChannelMessages');
const fs = require('fs')
const path = require('path')
const databasePath = path.join(__dirname, '..', '..', 'data', databaseName);

module.exports = async (client) => {
    if (!chatScrape) return;
    
    try{
        fs.unlinkSync(databasePath);
    } catch {
        console.error("Error deleting Database");
    }

    for (const channelId of readableChannels ){
        await parseAllChannelMessages(client, channelId, databaseName);
    }

    //console.log(messages);
};