const pg = require('pg');

// Create a connection to our database
const pool = new pg.Pool({ // Alternate entry: const { Pool } = require('pg.Pool');
    // This option is required
    database: 'music_library',
    // These option not required, but may see them:
    host: 'localhost', // where is your database
    port: 5432, // port number for DB, 5432 is default
    max: 10, // max connections at one time
    idleTimeoutMillis: 30000 // 30 sec to try to connect
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

// Share the DB connection yo!
module.exports = pool;