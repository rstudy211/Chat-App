import logo from "./logo.svg";
import "./App.css";
import SockJS from "sockjs-client";

import ChatRoom from "./components/ChatRoom";
import { useState } from "react";
function App() {
  return (
    <div className="App">
      <div className="flex h-[100vh] justify-center items-center">
        <ChatRoom></ChatRoom>
      </div>
    </div>
  );
}

export default App;
