const sqlite3 = require('sqlite3');
const getDatabase = require('./getDatabase');
const insertDatabase = require('./insertDatabase');

module.exports = async (client, channelId, database) => {
    const db = getDatabase(database)

    const channel = await client.channels.cache.get(channelId);
    //let messages = [];

    let message = await channel.messages.fetch({limit: 1})
    message = message.size === 1 ? message.at(0) : null
    
    //Gets all messages in channel
    while (message) {
        const messagePage = await channel.messages.fetch({ limit: 100, before: message.id })
        //messagePage.forEach(msg => messages.push(msg))
        messagePage.forEach(msg => {
            if(msg["author"]["bot"] == false){
                testContent = msg["content"].replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
                userID = msg["author"]["id"];
                if(testContent != ''){
                    insertDatabase(userID, testContent, db);
                    //console.log(testContent);   
                }
            }
        })

        //logic for database parsing and insertion
        //console.log(messages);

        message = messagePage.size > 0 ? messagePage.at(messagePage.size - 1) : null
    }

    console.log("Completed Parse");
    console.log("Closing Database");
    
    //iterates through all messages
/*     messages.forEach(post => {
        if(post["author"]["bot"] == false){
            testContent = post["content"].replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
            userID = post["author"]["id"];
            if(testContent != ''){
                insertDatabase(userID, testContent, db);
                //console.log(testContent);

            }
        }
    });
     */
    db.close();
};