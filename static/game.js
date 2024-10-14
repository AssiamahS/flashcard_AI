document.addEventListener('DOMContentLoaded', function() {
    const socket = io.connect();

    function createRoom() {
        const room = prompt("Enter room name:");
        socket.emit('create_room', { room: room });
    }

    function joinRoom() {
        const room = prompt("Enter room name:");
        const username = prompt("Enter your username:");
        socket.emit('join_room', { room: room, username: username });
    }

    function submitFlashcards() {
        const room = prompt("Enter room name:");
        const flashcards = [
            { question: "Question 1", answer: "Answer 1" },
            { question: "Question 2", answer: "Answer 2" }
        ];
        socket.emit('submit_flashcards', { room: room, flashcards: flashcards });
    }

    function startGame() {
        const room = prompt("Enter room name:");
        socket.emit('start_game', { room: room });
    }

    socket.on('room_created', function(room) {
        document.getElementById('game').innerHTML = `Room ${room} created.`;
    });

    socket.on('room_joined', function(data) {
        document.getElementById('game').innerHTML = `Joined room ${data.room} as ${data.username}.`;
    });

    socket.on('flashcards_submitted', function(flashcards) {
        console.log('Flashcards submitted:', flashcards);
    });

    socket.on('game_started', function(flashcards) {
        console.log('Game started with flashcards:', flashcards);
    });

    socket.on('answer_received', function(data) {
        console.log(`${data.username} answered: ${data.answer}`);
    });

    // Create buttons for each action
    document.body.innerHTML += '<button onclick="createRoom()">Create Room</button>';
    document.body.innerHTML += '<button onclick="joinRoom()">Join Room</button>';
    document.body.innerHTML += '<button onclick="submitFlashcards()">Submit Flashcards</button>';
    document.body.innerHTML += '<button onclick="startGame()">Start Game</button>';
});
