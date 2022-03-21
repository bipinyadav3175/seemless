import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const usernameRef = useRef();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = e => {
    e.preventDefault();
    const id = uuidv4();

    setRoomId(id);
    usernameRef.current?.focus();

    toast.success("New Room Created");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room Id & Username is required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleFirstEnter = e => {
    if (e.code === "Enter") {
      usernameRef.current?.focus();
      return;
    }
  };

  const handleSecondEnter = e => {
    if (e.code === "Enter") {
      joinRoom();
      return;
    }
  };

  return (
    <div className="homeWrapper">
      <div className="formWrapper">
        <h1>Seemless</h1>
        <h4 className="mailLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputField"
            placeholder="ROOM ID"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            onKeyUp={handleFirstEnter}
          />
          <input
            ref={usernameRef}
            type="text"
            className="inputField"
            placeholder="USERNAME"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyUp={handleSecondEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            JOIN
          </button>
          <span className="createInfo">
            Don't have a Room ID? &nbsp;
            <a onClick={createNewRoom} className="createNewBtn">
              Create One
            </a>
          </span>
        </div>
      </div>

      <footer>
        <h4>Made with 💗 by DARKMAN</h4>
      </footer>
    </div>
  );
};

export default Home;
