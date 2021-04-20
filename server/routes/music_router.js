const express = require('express');
const { Pool } = require('pg');
const router = express.Router();


// Set up PG to connect with the DB!!!!
//const Pool = pg.Pool; // Alternat entry: const { Pool } = require('pg.Pool');
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: '5432',
    max: 10,
    idleTimeoutMillis: 30000
});

// we use .on so we know need the connection succeeded. There are many things that can go wrong
// Handle connection event:
pool.on('connect', () => {
    console.log('Postgresql connected!');
});
// Handle errors from connection
pool.on('error', error => {
    console.log('error with postgres pool', error);
});

let musicLibrary = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    //res.send(musicLibrary);
    let queryText = 'SELECT * FROM songs;'
    pool.query(queryText)
        .then(dbResult => {
            res.send(dbResult.rows);
        })
        .catch((error) => {
            console.log(`Error! It broke trying to query ${queryText}`, error);
            res.sendStatus(500);
        });
});

router.post('/', (req, res) => {
    musicLibrary.push(req.body);
    res.sendStatus(200);
});

module.exports = router;