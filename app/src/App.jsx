import React from "react";
import { StoreProvider } from "./components/context/StoreProvider";
import Store from "./utils/store";
import GameClient from "./utils/gameClient";
import Game from "./Game";

/*const getFromCookie = (key) => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`))
    ?.split("=")[1];
};*/

function App() {
  // get playerId from cookie
  // const playerId = getFromCookie("playerId");

  const store = new Store();

  const gameClient = new GameClient("ws://localhost:8000", store);

  store.set("playerList", []);

  gameClient.onPlayerJoined((player) => {
    console.log("player joined", player);
    const playerList = store.get("playerList");
    store.set("playerList", [...playerList, player]);
  })

  gameClient.onPlayerLeft((player) => {
    console.log("player left", player);
    const playerList = store.get("playerList");
    store.set("playerList", playerList.filter((p) => p !== player));
  })  

  

  store.set("playerName", "");
  store.set("roomCode", "");
  store.set("gameClient", gameClient);

  return (
    <>
      <StoreProvider store={store}>
        <Game />
      </StoreProvider>
    </>
  );
}

export default App;
