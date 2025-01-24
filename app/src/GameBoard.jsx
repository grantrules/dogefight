import React from "react";
import PropTypes from "prop-types";
import "./GameBoard.css";

//import { useStore } from "./components/context/StoreProvider";

const unicodeBackArrow = "\u2190";

function GameBoard({ setGameState }) {
  //const store = useStore();
  //const gameClient = store.get("gameClient");

  return (
    <>
      <h1>Game</h1>
      <button onClick={() => setGameState("home")}>{unicodeBackArrow}</button>
    </>
  );
}
GameBoard.propTypes = {
  setGameState: PropTypes.func.isRequired,
};

export default GameBoard;
