import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import axiosBaseURL from "../httpCommon";

const SocketContext = createContext();

const socket = io(process.env.REACT_APP_SOCKET_SERVER);

const ContextSocketProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [arrivalNotification, setArrivalNotification] = useState(null);

  //advertisment
  const [advertismentList, setAdvertismentList] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  // const [newAdvertisment, setNewAdvertisment] = useState("");
  // const [arrivalAdvertisment, setArrivalAdvertisment] = useState(null);
  // const { newAdvertisment, setNewAdvertisment, currentLocation, setCurrentLocation, advertismentList, setAdvertismentList, addUserToLocation, removeUserFromLocation, getNewMessageInLocation, postNewMessageInLocation } = SocketContext;

  const [friendTypingStatus, setFriendTypingStatus] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });
    // socket.on('userNotOnline', (signal) => {
    //   setCallAccepted(false);
    //   setCallEnded(true);
    // });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  const setArrivalMessageFirst = () => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  };
  const setArrivalNotificationFirst = () => {
    socket.on("getNotification", (data) => {
      setArrivalNotification({
        userFrom: data.senderId,
        userTo: data.receiverId,
        createdAt: Date.now(),
      });
    });
  };

  const addUser = (userId) => {
    // console.log("userId on adding user:",userId );
    socket.emit("addUser", userId);
  };

  const sendMessageEmit = (props) => {
    socket.emit("sendMessage", {
      senderId: props.senderId,
      receiverId: props.receiverId,
      text: props.text,
    });
  };

  const sendTypingUpdate = (props) => {
    socket.emit("typing", {
      senderId: props.senderId,
      receiverId: props.receiverId,
      text: "typing",
    });
    socket.on("typing", (data) => {
      console.log("show typing");
      setFriendTypingStatus(true);
    });
  };
  const sendStopTypingUpdate = (props) => {
    socket.emit("stopTyping", {
      senderId: props.senderId,
      receiverId: props.receiverId,
      text: "stop Typing",
    });
    socket.on("stopTyping", (data) => {
      console.log("stop typing");
      setFriendTypingStatus(false);
    });
  };

  const postNewAdInLocation = ( user, newAdvertisment, currentLocation ) => {
    socket.emit("postNewAdInLocation", {
      location: currentLocation,
      ad: newAdvertisment,
      user: user,
    });
  };
  const getNewAdInLocation = (currentLocation) => {
  socket.on("postNewAdInLocation", async(data) => {
    console.log("data.advertisment",data.ad)
    if (currentLocation === "") return;
    const post = await axiosBaseURL.get(`/posts/${data.ad.post}`);
    console.log("post.data",post.data)
    const tempAdvertisment = {
      location: data.location,
      post: post.data,
      user: data.user,
    };
    console.log("newAdvertisment",tempAdvertisment)
    if (tempAdvertisment.location === currentLocation) {
      setAdvertismentList((prev) => [...prev, tempAdvertisment]);
    }
    console.log("advertismentList",advertismentList);
  });
  };

  const addUserToLocation = (userId, currentLocation) => {
    socket.emit("addUserToLocation", {
      userId,
      location: currentLocation,
    });
  };
  const removeUserFromLocation = (userId, currentLocation) => {
    socket.emit("removeUserFromLocation", {
      userId,
      location: currentLocation,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        sendMessageEmit,
        addUser,
        conversations,
        setConversations,
        currentChat,
        setCurrentChat,
        messages,
        setMessages,
        newMessage,
        setNewMessage,
        arrivalMessage,
        setArrivalMessage,
        setArrivalMessageFirst,
        arrivalNotification,
        setArrivalNotification,
        setArrivalNotificationFirst,
        sendTypingUpdate,
        sendStopTypingUpdate,
        friendTypingStatus,
        // newAdvertisment,
        // setNewAdvertisment,
        currentLocation,
        setCurrentLocation,
        advertismentList,
        setAdvertismentList,
        addUserToLocation,
        removeUserFromLocation,
        postNewAdInLocation,
        getNewAdInLocation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextSocketProvider, SocketContext };
