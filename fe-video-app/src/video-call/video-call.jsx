import "./video-call.css";
import Footer from "../components/footer/footer"
import { CopyToClipboard } from "react-copy-to-clipboard";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PhoneIcon from "@material-ui/icons/Phone";
import io from "socket.io-client";
import { Button } from '@material-ui/core';

const socket = io.connect("https://mohsin-meets-backend.herokuapp.com/")


function VideoCall() {
  const [me, setme] = useState("");
  const [stream, setStream] = useState("");
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [username, setUsername] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [callerName, setcallerName] = useState("")
  const [usernameToCall, setusernameToCall] = useState("")


  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    //Get permission from user to use video camera and microphone
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
    })

    socket.on("me", (id) => {
      setme(id);
    })



    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setcallerName(data.name);
      setCallerSignal(data.signal);
    })

  }, [])
  useEffect(() => {
    if(username){
      socket.emit("addUser", username)
    }
  }, [name])

  useEffect(() => {
    const { name, username } = JSON.parse(localStorage.getItem("profile"));
    setUsername(username);
    setName(name);
  }, [])

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [{
          urls: 'stun:numb.viagenie.ca', credential: 'Mohsin123!',
          username: 'mohsingujjar08@gmail.com'
        },
        {
          urls: 'turn:numb.viagenie.ca', credential: 'Mohsin123!',
          username: 'mohsingujjar08@gmail.com'
        }]
      },
      stream: stream
    })

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        signalData: data,
        from: me,
        name: name,
        username: usernameToCall
      })
    })

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });


    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;

  }


  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      config: {
        iceServers: [{
          urls: 'stun:numb.viagenie.ca', credential: 'Mohsin123!',
          username: 'mohsingujjar08@gmail.com'
        },
        {
          urls: 'turn:numb.viagenie.ca', credential: 'Mohsin123!',
          username: 'mohsingujjar08@gmail.com'
        }]
      },
      trickle: false,
      stream: stream
    })

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller })
    })


    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal)
    connectionRef.current = peer;
  }


  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  }

  return (
    <div className="App">
      <div className="container">
        <div >
          {stream && <video className="video" playsInline muted ref={myVideo} autoPlay />}
        </div>

        <div>
          {callAccepted && !callEnded ?
            <video className="video" playsInline ref={userVideo} autoPlay /> : null}
        </div>

        <div className="details">
          <div className="u-name">
            Hello {name} !
          </div>
          <TextField
            className="i-details"
            label="Enter username to Call"
            variant="outlined"
            value={usernameToCall}
            onChange={(e) => setusernameToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call with {callerName}
              </Button>
            ) : (
              <IconButton color="primary" aria-label="call" onClick={() => callUser(usernameToCall)}>
                <PhoneIcon fontSize="large" />
              </IconButton>
            )}
          </div>
        </div>
      </div>


      <div>
        {receivingCall && !callAccepted ? (
          <div className="caller">
            <h1 >{callerName} is calling...</h1>
            <Button variant="contained" color="primary" onClick={answerCall}>
              Answer
            </Button>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
}

export default VideoCall;