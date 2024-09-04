const sqlite3 = require('sqlite3');
const path = require("path");
const fs = require('fs');
const {databaseName} = require('../../config.json');
const {minSentenceCount} = require('../../config.json');
const {maxSentenceCount} = require('../../config.json');
const getDatabase = require('./getDatabase');
const nlp = require('compromise');

const randsql = `
    SELECT possible_words FROM wordlist
    WHERE current_word IS NULL
    ORDER BY RANDOM ()
    LIMIT 1
    `;

const nextsql = `
    SELECT possible_words FROM wordlist
    WHERE current_word = ?
    ORDER BY RANDOM()
    LIMIT 1
    `;

const randsqluser = `
    SELECT possible_words FROM wordlist
    WHERE user_id IN (?,?) and current_word IS NULL
    ORDER BY RANDOM()
    LIMIT 1
    `;

const nextsqluser = `
    SELECT possible_words FROM wordlist
    WHERE user_id IN (?,?) AND current_word = ?
    ORDER BY RANDOM()
    LIMIT 1
    `;

const checkidsql = `
    SELECT * FROM wordlist
    WHERE user_id = ?
    `;


const all = async () => {
    let db = getDatabase(databaseName);

    let wordCount = 0;
    let sentenceArray = [];
    let currentword = await getFirstWord(db);
    await sentenceArray.push(currentword);
    
    while(wordCount < maxSentenceCount){
        currentword = await getNextWord(db, currentword);
        await sentenceArray.push(currentword);

        let periodcheck = await currentword.charAt(currentword.length - 1) == '.';
        if(periodcheck && wordCount > minSentenceCount){
            break;
        } else if (periodcheck) {
            currentword = await getFirstWord(db);
            await sentenceArray.push(currentword);
        }

        wordCount = wordCount + 1;
    }

    db.close();
    let sentence = await sentenceArray.join(' ');
    sentence = await correctSentence(sentence);
    //await console.log(sentence);
    return sentence;
};

const user = async function(userID){
    let db = getDatabase(databaseName);

    let wordCount = 0;
    let sentenceArray = [];

    if(await checkIDUser(db, userID) === false){
        throw new Error('Invalid ID');
    }

    let currentword = await getFirstWordUser(db, userID);
    await sentenceArray.push(currentword);

    while(wordCount < maxSentenceCount){
        currentword = await getNextWordUser(db, userID, currentword);
        await sentenceArray.push(currentword);

        let periodcheck = await currentword.charAt(currentword.length - 1) == '.';
        if(periodcheck && wordCount > minSentenceCount){
            break;
        } else if (periodcheck) {
            currentword = await getFirstWordUser(db, userID);
            await sentenceArray.push(currentword);
        }

        wordCount = wordCount + 1;
    }

    db.close();
    let sentence = await sentenceArray.join(' ');
    sentence = await correctSentence(sentence);
    return sentence;
};

async function getFirstWord(db) {
    return new Promise((resolve, reject) => {
        db.all(randsql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let result = rows[0].possible_words;
                resolve(result);
            }
        });
    });
}

async function getNextWord(db, currentword) {
    return new Promise((resolve, reject) => {
        db.all(nextsql, [currentword], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                try{
                    let result = rows[0].possible_words;
                    resolve(result);
                } catch {
                    resolve('.');
                }
            }
        });
    });
}

async function getFirstWordUser(db, userid) {
    return new Promise((resolve, reject) => {
        let olduserid = userid;
        //check for miguel's old account
        if(userid == '611263081536028682'){
            olduserid = '456226577798135808';
        }
        db.all(randsqluser, [userid, olduserid], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let result = rows[0].possible_words;
                resolve(result);
            }
        });
    });
}

async function getNextWordUser(db, userid, currentword) {
    return new Promise((resolve, reject) => {
        let olduserid = userid;
        //check for miguel's old account
        if(userid == '611263081536028682'){
            olduserid = '456226577798135808';
        }
        db.all(nextsqluser, [userid, olduserid, currentword], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                try{
                    let result = rows[0].possible_words;
                    resolve(result);
                } catch {
                    resolve('.');
                }
            }
        });
    });
}

async function checkIDUser(db, userid) {
    return new Promise((resolve, reject) => {
        db.all(checkidsql, [userid], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length === 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

function correctSentence(sentence) {
    let doc = nlp(sentence);
    doc = doc.normalize();  // Normalize the sentence
    return doc.out('text');
}

module.exports = {
    all,
    user,
};