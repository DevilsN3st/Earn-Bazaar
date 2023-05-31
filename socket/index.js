const io = require("socket.io")(process.env.PORT || 8900, {
  cors: {
    origin: process.env.ORIGIN,
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId: userId, socketId: socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    // console.log("userId on adding user:",userId);
    addUser(userId, socket.id);
    // io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    addUser(receiverId, socket.id);
    const user = getUser(receiverId);
    // console.log(senderId, receiverId, text, user, users);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });


  socket.emit("me", socket.id);
  
	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    const userSocketId = getUser(userToCall);
    // console.log("userSocketId:",userSocketId);
    if( userSocketId === undefined ){
      io.to(from).emit("userNotOnline");
    }
    else{
      // console.log("user online");
      io.to(userSocketId.socketId).emit("callUser", { signal: signalData, from, name });
    }
	});

	socket.on("answerCall", (data) => {
    console.log("answered");
		io.to(data.to).emit("callAccepted", data.signal)
	});




  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
