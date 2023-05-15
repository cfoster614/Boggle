from boggle import Boggle
from flask import Flask, request, render_template, session, redirect, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "scamp" 
app.debug = True

debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def show_start():
    
    return render_template("index.html")

@app.route('/make-board')
def make_board():
    board_size = int(request.args.get('boardSize'))
    board = boggle_game.make_board(board_size)
    session['board'] = board
   
    return jsonify({'result': board})



@app.route('/check_word')
def check_word():
    word = request.args['word']
    board = session['board']
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})
