from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('create_room')
def create_room(data):
    room = data['room']
    rooms[room] = {'flashcards': [], 'players': []}
    join_room(room)
    emit('room_created', room, room=room)

@socketio.on('join_room')
def join_room(data):
    room = data['room']
    username = data['username']
    if room in rooms:
        rooms[room]['players'].append(username)
        join_room(room)
        emit('room_joined', {'room': room, 'username': username}, room=room)
    else:
        emit('error', 'Room does not exist')

@socketio.on('submit_flashcards')
def submit_flashcards(data):
    room = data['room']
    flashcards = data['flashcards']
    rooms[room]['flashcards'] = flashcards
    emit('flashcards_submitted', flashcards, room=room)

@socketio.on('start_game')
def start_game(data):
    room = data['room']
    flashcards = rooms[room]['flashcards']
    random.shuffle(flashcards)
    emit('game_started', flashcards, room=room)

@socketio.on('answer')
def answer(data):
    room = data['room']
    username = data['username']
    emit('answer_received', {'username': username, 'answer': data['answer']}, room=room)

if __name__ == '__main__':
    socketio.run(app)
