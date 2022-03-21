import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";

import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";

const EditorPage = () => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const socketRef = useRef(null)
  const codeRef = useRef(null)
  const location = useLocation()

  const [clients, setClients] = useState([]);

  const copyRoomId = async ()=> {
    try{
      await navigator.clipboard.writeText(roomId)
      toast.success("Room ID copied")
      return

    }catch(err){
      console.log(err)
      toast.error("Unable to copy Room ID!")
      return
    }
  }

  const leaveRoom = ()=> {
    navigate("/")
  }

  useEffect(() => {
    async function init() {

      function handleErrors(e) {
        console.log("socket error", e)
        toast.error("Socket connection failed, try again later.")
        navigate("/")
      }

      socketRef.current = await initSocket()

      socketRef.current.on("connect_error", err => handleErrors(err))
      socketRef.current.on("connect_failed", err => handleErrors(err))

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      })

      // Listening for new connection
      socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId})=> {
        if(username !== location.state.username){
          toast.success(`${username} joined the room.`)
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            socketId,
            code: codeRef.current
          })
        }
        setClients(clients)
      })

      // listening for disconneted
      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username})=> {
        toast.error(`${username} left the room.`)
        setClients((oldData)=> {
          return oldData.filter((client)=> client.socketId !== socketId )
        })
      })

    }
    init()

    return ()=> {
      socketRef.current.off(ACTIONS.DISCONNECTED)
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.disconnect()
    }

  }, [])






  

  if (!location.state) {
    return <Navigate to="/" />
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <h1>Seemless</h1>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map(client => {
              return (
                <Client key={client.socketId} username={client.username} />
              );
            })}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>Copy Room Id</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
      </div>
      <div className="editor">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => codeRef.current = code} />
      </div>
    </div>
  );
};

export default EditorPage;
