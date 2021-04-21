// const { response } = require('express');
const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');


// let musicLibrary = [
//     {
//         rank: 355, 
//         artist: 'Ke$ha', 
//         track: 'Tik-Toc', 
//         published: '1/1/2009'
//     },
//     {
//         rank: 356, 
//         artist: 'Gene Autry', 
//         track: 'Rudolph, the Red-Nosed Reindeer', 
//         published: '1/1/1949'
//     },
//     {
//         rank: 357, 
//         artist: 'Oasis', 
//         track: 'Wonderwall', 
//         published: '1/1/1996'
//     }
// ];

// Grabs a list of songs
// Get /musicLibrary, go ask DB for some data, send it back to the client
router.get('/', (req, res) => {
    // pool = DB connection
    // Query the DB using SQL
    let queryText = 'SELECT * FROM "songs" ORDER BY "rank";'
    pool.query(queryText)
        // Get back DB results
        .then(dbResult => {
            res.send(dbResult.rows);
        })
        .catch((error) => {
            console.log(`Error! It broke trying to query ${queryText}`, error);
            res.sendStatus(500);
        });
});

router.get('/:id', (req, res) => {
    console.log('req.params', req.params);
    let songId = req.params.id;
    console.log('songId', songId);

    pool.query(`SELECT * FROM "songs" WHERE "id"=$1;` [songId])
        .then(result => {
            console.log('result.rows', result.rows);
            console.log('result.rows[0]', result.rows[0]);
            // If no matching record, send back 404
            if (!result.rows[0]) {
                res.sendStatus(404);
                return;
            }
            // Send back single matching record
            res.send(result.rows[0]);
        })
        .catch(error => {
            console.log('Get by Id failed:', error);
            res.sendStatus(500);
        });
});

// Create POST /musicLibrary
// Request body looks like : {artist: 'aaa', track: 'bbb', published: '1-1-2000',rank: 4}
router.post('/', (req, res) => {
     // Create INSERT query for POSTING a new record to the DB:
     // VALUES (${song.rank}, '${song.track}', '${song.artist}', '${song.published}')
     const bananas = `INSERT INTO "songs" ( artist, track, published, rank)
     VALUES ($1, $2, $3, $4);`;
     //RETURNING "id";`;
    
     const song = {
        artist: req.body.artist,
        track: req.body.track,
        published: req.body.published,
        rank: req.body.rank
    };
   
    pool.query(bananas, [req.body.artist, req.body.track, req.body.published, req.body.rank])
        .then(result => {
            console.log('result', result);
            // PG results will always have a [] for the .rows property
            if (result.rows !== []) {
                res.sendStatus(201); // Proper response in many opinion, (200) also option
            }
        })
        .catch(err => {
            console.log(`didnt work, ${bananas}`);
            res.sendStatus(500);
        })
});

// UPDATE 
// PUT /musicLibrary/4 --- Updates single song;
// req.body = { "direction": "up"}; 'up' or 'down' only options.
// Any other value in the body will throw a 500 error.
router.put('/:id', (req, res) => {
    console.log(req.body);
    let songId = req.params.id;

    // get vote direction from request body, up or down
    let direction = req.body.direction;
    let queryText = ``;

    if (direction === 'up') {
        queryText = `UPDATE "songs" SET "rank"=rank+1 WHERE "id"=$1;`;
    } else if (direction === 'down') {
        queryText = `UPDATE "songs" SET "rank"=rank-1 WHERE "id"=$1;`;
    } else {
        // If we don't get expected direction, send back bad status
        res.sendStatus(500);
        return;
    }

    // Send request to the DB
    // Only using 1 query param, so we only have 1 object in array
    pool.query(queryText, [songId])
        .then(response => {
            console.log('Song edited', response);
            res.sendStatus(200); // server must always send response
        })
        .catch(error => {
            console.log(`Error making database query ${queryText}`, error);
            res.sendStatus(500);    
        });
});

// DELETE endpoint ... could be '/songs/:id'
router.delete('/:id', (req, res) => {
    const recordToDelete = req.params.id;
    console.log('Delete request id', recordToDelete);
    
    const queryText = `DELETE FROM "songs" WHERE id=$1;`;
    pool.query(queryText, [recordToDelete])
        .then(result => {
            console.log('Song deleted');
            res.sendStatus(200);
        })
        .catch(err => {
            console.log(`Error making DB query ${queryText}`, error);
            res.sendStatus(500); // Server always responds
        })
});

module.exports = router;