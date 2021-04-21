//const { response } = require("express");

$(document).ready(onReady);

function onReady() {
    getMusicData();
    $('#add').on('click', postMusicData);
    // Listener for UP Vote click
    $('#musicTableBody').on('click', '.vote-up', putUpVoteHandler);
    // Listener for DOWN VOTE click
    $('#musicTableBody').on('click', '.vote-down', putDownVoteHandler);
    // Listener for DELETE song
    $('#musicTableBody').on('click', '.delete-song', deleteSongHandler);
}

// get artist data from the server
function getMusicData() {
    $("#musicTableBody").empty();
    $.ajax({
        type: 'GET',
        url: '/musicLibrary'
    }).then(function (response) {
        console.log("skjfhsd", response);
        // append data to the DOM
        for (let i = 0; i < response.length; i++) {
            $(`#musicTableBody`).append(`
            <tr>
                <td>${response[i].artist}</td>
                <td>${response[i].track}</td>
                <td>${response[i].rank}</td>
                <td>${response[i].published}</td>
                <td>
                    <button class="vote-up" data-id="${response[i].id}">Up Vote</button>
                    <button class="vote-down" data-id="${response[i].id}">Down Vote</button>
                    <button class="delete-song" data-id="${response[i].id}">Delete</button>
                </td>
            </tr>
           `);
        }
    });
}

function postMusicData() {
    // This object becomes req.body in express
    let payloadObject = {
        artist: $('#artist').val(),
        track: $('#track').val(),
        rank: $('#rank').val(),
        published: $('#published').val(),
    }
    $.ajax({
        type: 'POST',
        url: '/musicLibrary',
        data: payloadObject
    }).then( function (response) {
        $('#artist').val(''),
        $('#track').val(''),
        $('#rank').val(''),
        $('#published').val(''),
        getMusicData();
    });
}

// Handler for UP Vote. Passes songId and direction to API PUT call
function putUpVoteHandler() {
    voteOnSong($(this).data("id"), "up");
}

// Handler for DOWN Vote. Passes songId and direction to API PUT call
function putDownVoteHandler() {
    voteOnSong($(this).data("id"), "down");
}

// PUT AJAX call for changing vote on song
function voteOnSong(songId, voteDirection) {
    $.ajax({
        method: 'PUT',
        url: `/musicLibrary/${songId}`,  //  songs/rank/
        data: {
            direction: voteDirection 
        }
    })
    .then(function(response) {
        console.log('response', response);
        // refresh song list with new data
        getMusicData();
    })
    .catch(error => {
        alert('Error on vote on song', error);
    })
}

// Handler for delete button
function deleteSongHandler() {
    // call AJAX to delete song
    deleteSong($(this).data("id"));
}

// DELETE AJAX call for deleting song
function deleteSong(songId) {
    $.ajax({
        method: 'DELETE',
        url: `/musicLibrary/${songId}`,     //  songs/
    })
    .then(response => {
        console.log('deleted it');
        getMusicData();
    })
    .catch(error => {
        alert('error on delete line 50', error)
    });
}