import React, { useState } from "react";
import PropTypes from "prop-types";
import GameBoard from "./GameBoard";
import "./App.css";
import { useStore } from "./components/context/StoreProvider";

function Game() {
  const store = useStore();
  const gameClient = store.get("gameClient");

  function join(room) {
    return new Promise((resolve) => {
      gameClient.onJoined((room) => {
        console.log("joined", room);
        store.set("roomCode", room);
        setGameState("game");
        resolve(room);
      });
      gameClient.join(room);
    });
  }

  function create() {
    return new Promise((resolve) => {
      gameClient.onCreated((room) => {
        console.log("created", room);
        store.set("roomCode", room);
        setGameState("game");
        resolve(room);
      });
      gameClient.create();
    });
  }

  const [gameState, setGameState] = useState("home");
  const components = {
    home: <GameHome setGameState={setGameState} />,
    create: <CreateGame setGameState={setGameState} create={create} />,
    join: <JoinGame setGameState={setGameState} join={join} />,
    game: <GameBoard setGameState={setGameState} />,
  };

  return <>{components[gameState] || ""}</>;
}

function GameHome({ setGameState }) {
  return (
    <>
      <div className={"dogefight"}>
        <img src="/assets/dogefight.png" alt="dogefight" />
      </div>
      <button
        onClick={() => setGameState("create")}
        className="startbutton startbutton-create"
      >
        Create Game
      </button>
      <button
        onClick={() => setGameState("join")}
        className="startbutton startbutton-join"
      >
        Join Game
      </button>
    </>
  );
}

function CreateGame({ setGameState, create }) {
  const store = useStore();

  const roomCode = store.use(() => store.get("roomCode"));
  console.log(roomCode);

  async function handleCreate() {
    await create();
  }

  return (
    <>
      {!roomCode && (
        <>
          <h1>Create Game</h1>
          <input type="text" placeholder="Enter your name"></input>
          <button
            onClick={() => handleCreate()}
            className="startbutton startbutton-create"
          >
            Create Game
          </button>
          <button onClick={() => setGameState("home")}>
            {unicodeBackArrow}
          </button>
        </>
      )}
    </>
  );
}

const unicodeBackArrow = "\u2190";

function JoinGame({ setGameState, join }) {
  const [input, setInput] = useState({
    playerName: "",
    roomCode: "",
  });

  const handleEvent = (input) => (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    join(input.roomCode);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Join Game</h1>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={handleEvent(input)}
        ></input>
        <input
          type="text"
          placeholder="Enter room code"
          onChange={handleEvent(input)}
        ></input>
        <button className="startbutton startbutton-join">Join Game</button>
        <button onClick={() => setGameState("home")}>{unicodeBackArrow}</button>
      </form>
    </>
  );
}
GameHome.propTypes = {
  setGameState: PropTypes.func.isRequired,
};

JoinGame.propTypes = {
  setGameState: PropTypes.func.isRequired,
  join: PropTypes.func.isRequired,
};

CreateGame.propTypes = {
  setGameState: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
};

export default Game;
