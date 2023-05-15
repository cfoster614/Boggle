$('.hide-game').hide();
let score = 0;


//Calls to server to get boggle board
async function makeBoard(e) {
    e.preventDefault();
    $('.options').hide();
    $('.hide-game').show();
    $('#letter-container').show();
    $('#form').show();
    // $('.hide-game').hide();

    //Get the value of radio input for board size
    const boardSize = $('input[type="radio"]:checked').val();
  
    //Call to server to get the actual board using boardSize as a param
    const resp = await axios.get('/make-board', {params: {boardSize: boardSize}});

    //This should give back an arr of (length, ex: 6) arrays
    const board = resp.data.result
    console.log(board)
   
    //Make the board. Board.length should be 5, 6, or 7
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            //This gets us each individual letter and makes a div in the letter container
            $('#letter-container').append($('<div>', {'text': board[i][j], 'class': 'letter'}))
        }
    }
    $('#letter-container').attr('class', `board-size${board.length}`); //change class name when new board is picked
    $("input[name='board-size']").prop("checked", false); //make form not checked for next time
}


//Check if a word is correct
async function getWord(e) {
    e.preventDefault();

    //value of the form that the word is entered into
    const word = $('.word').val();

    //Call to the server to check the word given through the boggle logic in py
    const resp = await axios.get('/check_word', {params: {word: word}});

    //returns the result of if the word is allowed
    //result function let's us access the DOM with this info
    return result(resp.data, word);

}


//Result whether or not the word is correct, showing in the DOM
function result(res, word) {
    console.log(res.result, word)
    const result = res.result;
    const $result = $('#result')
    const pointsEarned = word.length
    $result.empty();
    
    if (result === 'ok') {
        clearInterval(timer);
        startTimer();
        $result.text('Nice!');
        score += pointsEarned;
        $('#score').text(score);
        $('ul').append(`<li>${word}</li>`).trigger('word-added');
    }
    if (result === 'not-on-board') {
        $result.text('That word isn\'t on the board, can\'t you read?')
    }
    if (result === 'not-word') {
        $result.text('That\'s not a word, silly!');
    }
}

let timer;
function startTimer() {
   
    let count = 60;
    timer = setInterval(function() {
        count --;
        $('#seconds').text(`${count} sec`);
        
        if(count === 0) {
            clearInterval(timer);
            $('#seconds').text("Time is up!");
            
            // stopGame();
        } 

    }, 1000);
}

function playAgain() {
    $('.letter').remove(); //removes all letters in board
    $('.options').show(); //show the game options again
    
    $('.hide-game').hide();
    $('#letter-container').hide();
    $('#play-again').hide();
}

function stopGame() {
    $('#form').hide();
    $('#play-again').show();
}

$('#start').on('click', makeBoard); // Starts game by making board
$('#start').on('click', startTimer); //Starts game timer
$('#form').on('submit', getWord); //Check word when entered
$('#play-again').on('click', playAgain); //Reset game, shows game options again

