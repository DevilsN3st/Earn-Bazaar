import "./messenger.css";
// import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import VideoChat from "../videoChat/VideoChat";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../context/Context";
// import axios from "axios";
import { io } from "socket.io-client";
import axiosBaseURL from "../httpCommon";

import { Container, Row, Col, Button } from "react-bootstrap";

import { SocketContext } from "../videoChat/Context";
import { Link } from "react-router-dom";

export default function Messenger() {
  const { user } = useContext(Context);
  const {
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
    setArrivalMessageFirst,
    leaveCall,
    sendTypingUpdate,
    friendTypingStatus,
  } = useContext(SocketContext);
  const scrollRef = useRef();
  const [friendId, setFriendId] = useState("");
  const [friend, setFriend] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [callFriend, setCallFriend] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  console.log(callFriend)

  useEffect(() => {
    setArrivalMessageFirst();
  }, []);

  useEffect(() => {
    const getFriend = async () => {
      const res = await axiosBaseURL.get(`/users/?userId=${friendId}`);
      console.log(res);
      setFriend(res.data);
    };
    getFriend();
  }, [friendId]);

  console.log("friend", friend);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    addUser(user._id);
    //     socket.current.on("getUsers", (users) => {
    //       setOnlineUsers(
    //         user.followings.filter((f) => users.some((u) => u.userId === f))
    //       );
    //     });
  }, [user]);
  // console.log(user?._id);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosBaseURL.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosBaseURL.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
      // console.log("messages += ", messages);
    };
    getMessages();
  }, [currentChat]);

  // console.log(currentChat);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    const sendMessageProp = {
      senderId: user._id,
      receiverId: receiverId,
      text: newMessage,
    };

    sendMessageEmit(sendMessageProp);

    try {
      let firstUserId = user._id;
      let secondUserId = receiverId;
      const exists1 = await axiosBaseURL.get(
        `/conversations/find/${firstUserId}/${secondUserId}`
      );
      firstUserId = receiverId;
      secondUserId = user._id;
      const exists2 = await axiosBaseURL.get(
        `/conversations/find/${secondUserId}/${firstUserId}`
      );
      message.conversationId = exists1.data || exists2.data;
      // console.log(message);
      const res = await axiosBaseURL.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = (e) => {};

  const handleConversations = (e, c) => {
    setCurrentChat(c);
    const friendUserId = c.members.find((m) => m !== user._id);
    setFriendId(friendUserId);
  };

  useEffect(() => { 
    if( newMessage !== "" ){
      const receiverId = currentChat.members.find(
        (member) => member !== user._id
      )
      const typingProp = {
        senderId: user._id,
        receiverId: receiverId,
      }
      sendTypingUpdate(typingProp)
    }
  }, [newMessage])

  useEffect(() => { 
    setShowTyping(friendTypingStatus);
  }, [friendTypingStatus, friendId])


  // console.log(user);
  // console.log(conversations);
  // console.log(messages);
  console.log(currentChat);

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for friends"
              className="chatMenuInput"
              onChange={(e) => handleSearch(e)}
            />
            {conversations?.map((c) => (
              <div onClick={(e) => handleConversations(e, c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  <Container className="conversation">
                    <Col xl={2}>
                    <img
                      className="conversationImg"
                      src={
                        user?.profilePicture
                        ? PF + user.profilePicture
                        : PF + "person/noAvatar.png"
                      }
                      alt=""
                      />
                        </Col>
                      <Col xs={9}>
                    <Link to={`/profile/${user.username}`}>
                      <span className="conversationName">
                        {friend?.username} 
                      </span>
                    </Link>
                      </Col>
                      <Col>
                    {
                      callFriend===false ? (
                        
                        <Button variant="success" onClick={() => setCallFriend(true)}> Call </Button>
                        ):(
                          <Button varian="danger" onClick={() => {
                            setCallFriend(false)
                            leaveCall()
                          }}> End Call </Button>
                          
                          )
                        }
                        </Col>
                  </Container>
                </div>
                <div className="chatBoxMiddle">
                  {messages?.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                  {showTyping && ( <p>Typing...</p>   )}
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        {(callFriend===false) ? (
          <></>
        ) : (
          <div className="chatOnline">
            <VideoChat friendId={friendId} userName={user?.username} />
          </div>
        )}
        {/* <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            /> 
          </div>
        </div> */}
      </div>
    </>
  );
}
