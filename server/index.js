// create express server
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { createServer } from 'node:http';
import pg from 'pg';

const app = express();
const server = createServer(app);
const io = new Server(server,
    {
        cors: {
          origin: ["https://localhost:8000"]
        },
        path: '/io'
    }
);

const port = 3000;

// connect to postgre
const client = new pg.Client({
    user: 'postgres',
    host: 'db',
    database: 'dogefight',
    password: 'postgres',
    port: 5432,
    }
);

client.connect();

app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);

function createCode() {
    let code = '';
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 5; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
        }
    return code;
}

io.on('connection', (socket) => {
    let name = "";
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        }
    );


    socket.on('join', (room) => {
        socket.join(room);
        console.log('user joined room: ' + room);
        io.to(room).emit('player joined', 'player');

        // add player to database
        client.query('INSERT INTO players (room, name) VALUES ($1, $2)', [room, 'player'], (err, res) => {
            if (err) {
                console.log(err.stack);
                }
            else {
                console.log('player added');
                }
            }
        );

        }
    );

    socket.on('create', () => {
        const room = Math.random().toString(36).substring(7);
        socket.join(room);
        console.log('user created room: ' + room);
        socket.emit('created', room);
    });

    socket.on('action', (msg) => {
        console.log('action: ' + msg);
        io.emit('action', msg);
        }
    );

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
        }
    );
    }
);
