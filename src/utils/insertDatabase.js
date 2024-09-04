const sqlite3 = require('sqlite3');
const insertTable = `
INSERT INTO wordlist (
    user_id,
    current_word,
    possible_words
) VALUES(?,?,?)
`

module.exports = (userID, message, database) => {
    const db = database;
    const wordseq = message.split(' ');

    const promises = wordseq.map((word, index) => {
        const current_word = word;
        const previous_word = index === 0 ? null : wordseq[index - 1]; // Handle the first iteration
    
        return new Promise((resolve, reject) => {
            db.run(insertTable, [userID, previous_word, current_word], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });

    return Promise.all(promises)
        .then()
        .catch(err => console.error('Error:', err.message));

/*     wordseq.forEach(word => {
        current_word = word;

        db.run(insertTable, [userID,prev_word,current_word], (err) => {
            if(err){
                return console.log(err.message);
            }
            //console.log('Row Added');
        })

        prev_word = word;
        //Xconsole.log(word);
    }); */

};