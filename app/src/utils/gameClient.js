

import { io } from 'socket.io-client';

class GameClient {

    constructor(url, store) {
        this.connect(url);
        this.room = null;
        this.store = store;
    }

    connect(url) {
        this.socket = io(url, { path: "/io"});
        console.log(`connection to ${url}`);
    }

    disconnect() {
        this.socket.disconnect();
    }

    join(room) {
        this.room = room;
        this.socket.emit('join', room);
    }

    create() {
        this.socket.emit('create');
    }

    action(msg) {
        this.socket.emit('action', msg);
    }

    chat(msg) {
        this.socket.emit('chat message', msg);
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    off(event, callback) {
        this.socket.off(event, callback);
    }
    onPlayerJoined(callback) {  // callback(playerName)
        this.socket.on('player joined', callback);
    }

    onPlayerLeft(callback) {  // callback(playerName)
        this.socket.on('player left', callback);
    }

    onCreated(callback) {  // callback(room)
        this.socket.on('created', callback);
    }

    onAction(callback) {  // callback(msg)
        this.socket.on('action', callback);
    }

    onChat(callback) {  // callback(msg)
        this.socket.on('chat message', callback);
    }

}

export default GameClient;