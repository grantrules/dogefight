import React, { useState } from "react";
import PropTypes from "prop-types";
import GameBoard from "./GameBoard";
import "./App.css";
import { useStore } from "./components/context/StoreProvider";
import Modal from "./Modal";

function Game() {
  const store = useStore();
  const playerId = store.use(() => store.get("playerId"));
  const gameClient = store.get("gameClient");

  const [showWelcome, setShowWelcome] = useState(false);

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

  const confirmWelcome = (func) => () =>{
    if (playerId) {
      return func();
    }
    setShowWelcome(true);

  };

  const components = {
    home: <GameHome setGameState={setGameState}  confirmWelcome={confirmWelcome}  />,
    create: <CreateGame setGameState={setGameState} create={create} />,
    join: <JoinGame setGameState={setGameState} join={join} />,
    game: <GameBoard setGameState={setGameState}/>,
  };

  return <>
  {components[gameState] || ""}
  {showWelcome && <WelcomeModal close={() => setShowWelcome(false)} />}

  </>;
}

function GameHome({ setGameState, confirmWelcome }) {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <div className={"dogefight"}>
        <picture>
          <source media="(min-width: 1200px)" srcSet="/assets/dogefight.png" />
          <img src="/assets/dogev.png" alt="Dogefight" />
        </picture>
      </div>
      <button
        onClick={confirmWelcome(() => setGameState("create"))}
        className="btn-big btn-create"
      >
        Create
      </button>
      <button onClick={confirmWelcome(() => setGameState("join"))} className="btn-big btn-join">
        Join
      </button>
      <button onClick={() => setShowAbout(true)} className="btn-big btn-about">
        About
      </button>
      {showAbout && <AboutModal close={() => setShowAbout(false)} />}
    </>
  );
}

function AboutModal({ close }) {
  return <Modal close={close} content={<div>Hey</div>} />;
}

function WelcomeModal({ close }) {

  const [welcomeState, setWelcomeState] = useState("welcome");

  const [avatar, setAvatar] = useState(1);

  const [input, setInput] = useState({ name: "" });

  const handleInput = (key) => (e) => {
    setInput({ ...input, [key]: e.target.value });
  }


  return (
    <>
    {welcomeState}
    {welcomeState === "welcome" &&
    <Modal
      close={close}
      content={
        <div className="modal-welcome">
          <div className="flex-center">
            <img className="img-holup" src="/assets/holup.png" alt="Holup doge" />
            <p>
            Whoa there soldier! No humans allowed past this point! Okay fine.
            Just one. Look, you&apos;ll need an ID, though
            </p>
          </div>
        </div>  
      }
      otherButtons={
        <button className="btn-big btn-continue bg-color-2" onClick={() => setWelcomeState("info")}>
          Um.. okay
        </button>
      }
      closeText="Nah"
    />}

    {welcomeState === "info" &&
    <Modal
      close={close}
      content={
        <div className="modal-welcome">
          <div className="avatars">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                className={`img-avatar-${i} img-avatar ${avatar === i && "selected"}`}
                src={`/assets/avatars/${i}.jpeg`}
                alt={`Avatar ${i}`}
                onClick={() => setAvatar(i)}
              />))}
            </div>

            <h1>What&apos;s your name?</h1>
            <input type="text" value={input['name']} placeholder="Make it heroic" onChange={handleInput("name")}></input>

        </div>  
      }
      otherButtons={
        <button className="btn-big btn-continue bg-color-3" onClick={() => setWelcomeState("name")}>
          Let&apos;s go
        </button>
      }
      closeText="Nah"
      />
    }
    
    
    
    </>
  );
}

WelcomeModal.propTypes = {
  close: PropTypes.func.isRequired,
};

AboutModal.propTypes = {
  close: PropTypes.func.isRequired,
};

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
          <button onClick={() => handleCreate()} className="btn-big btn-create">
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
        <button className="btn-big btn-join">Join Game</button>
        <button onClick={() => setGameState("home")}>{unicodeBackArrow}</button>
      </form>
    </>
  );
}
GameHome.propTypes = {
  setGameState: PropTypes.func.isRequired,
  confirmWelcome: PropTypes.func.isRequired,
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
