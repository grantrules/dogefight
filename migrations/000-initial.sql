-- create rooms table

CREATE TABLE rooms (
  room_code VARCHAR(255) NOT NULL PRIMARY KEY,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX room_code_index ON rooms (room_code);



-- create players table

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  player_order INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create player_room table

CREATE TABLE player_room (
  player_id INT NOT NULL REFERENCES players(id),
  room_code VARCHAR(255) NOT NULL REFERENCES rooms(room_code),
  PRIMARY KEY (player_id, room_code)
);

-- create deck table

CREATE TABLE deck (
  name VARCHAR(255) NOT NULL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO deck (name) VALUES ('base');

-- create cards table

CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  deck_name VARCHAR(255) NOT NULL REFERENCES deck(name),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



