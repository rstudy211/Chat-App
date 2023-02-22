import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";

var stompClient = null;

const ChatRoom = () => {
  const [userData, setUserData] = useState({
    username: "",
    reciever: "",
    connected: false,
    message: "",
  });
  useEffect(() => {
    console.log("Stomp");
    console.log(stompClient);
    console.log(userData);
  }, [userData]);
  const [publicChats, setPublicChats] = useState([]);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [tab, setTab] = useState("CHATROOM");

  const handleValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const registerUser = () => {
    let Sock = new SockJS("http://localhost:9001/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnnected, onError);
    console.log("jskskdjsdjsdk");
    console.log(stompClient);
    console.log(privateChats);
  };

  const onConnnected = () => {
    console.log(stompClient);
    console.log("in on connected");
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onPublicMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessageReceived
    );
    userJoin();
  };

  const userJoin = () => {
    let chatMessage = {
      sender: userData.username,
      message: userData.message,
      status: "JOIN",
    };
    console.log("stomclient in user Join");
    console.log(stompClient);
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    console.log(stompClient);
  };

  const onPublicMessageReceived = (payload) => {
    let payloadData = JSON.parse(payload.body);
    console.log("payload dksjdjksj");
    console.log(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.sender)) {
          privateChats.set(payloadData.sender, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        console.log(publicChats);
        break;
    }
  };
  const onPrivateMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.sender)) {
      privateChats.get(payloadData.sender).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.sender, list);
      setPrivateChats(new Map(privateChats));
    }
  };
  const onError = (err) => {
    console.log(err);
  };

  const sendPublicMessage = () => {
    console.log("in send public");
    console.log(stompClient);
    if (stompClient) {
      console.log("sjdkj");
      var chatMessage = {
        sender: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
      console.log(chatMessage);
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };
  const sendPrivateMessage = () => {
    if (stompClient) {
      var chatMessage = {
        sender: userData.username,
        receiver: tab,
        message: userData.message,
        status: "MESSAGE",
      };
      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };
  return (
    <div className="container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li
                onClick={() => {
                  setTab("CHATROOM");
                }}
                className={`member ${tab === "CHATROOM" && "active"}`}
              >
                ChatRoom
              </li>

              {[...privateChats.keys()].map((name, index) => (
                <li
                  onClick={() => setTab(name)}
                  className={`member ${tab === name && "active"}`}
                  key={index}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
          {tab === "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {publicChats.map((chat, index) => (
                  <li className="message" key={index}>
                    {/* <h1>{chat.sender}</h1> */}
                    {chat.sender !== userData.username && (
                      <div className="avatar">{chat.sender}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.sender === userData.username && (
                      <div className="avatar self">{chat.sender}</div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder="Enter public message"
                  value={userData.message}
                  name="message"
                  onChange={handleValue}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendPublicMessage}
                >
                  send{" "}
                </button>
              </div>
            </div>
          )}
          {tab !== "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {[...privateChats.get(tab)].map((chat, index) => (
                  <li className="message" key={index}>
                    {chat.sender !== userData.username && (
                      <div className="avatar">{chat.sender}</div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.sender === userData.username && (
                      <div className="avatar self">{chat.sender}</div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="send-message">
                <input
                  type="text"
                  className="input-message"
                  placeholder={`endter private message for ${tab}`}
                  value={userData.message}
                  name="message"
                  onChange={handleValue}
                />
                <button
                  type="button"
                  className="send-button"
                  onClick={sendPrivateMessage}
                >
                  send{" "}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter the user name"
            value={userData.username}
            name="username"
            onChange={handleValue}
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
