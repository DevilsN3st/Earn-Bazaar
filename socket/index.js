const io = require("socket.io")( process.env.PORT || 8900, {
  cors: {
    origin: process.env.ORIGIN,
  },
});
console.log("server started");

let users = [];

let locations = {};

const addUserToLocation = ( userId, location, socketId ) => {
  locations[location] ??= [];
  locations[location].push({userId, socketId});
}

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
const removeUserFromAllLocation = ( socket ) => {
  Object.keys(locations).forEach((loc) => {
    locations[loc] = locations[loc].filter((user) => user.socketId !== socket.id); 
  });
}
const removeUserFromLocation = ({ userId, location }, socket) => {
  console.log("remove user from location", locations[location], typeof locations[location]);
    // if(locations[location])locations[location] = locations[location].filter((user) => user.userId !== userId); 
    // Object.keys(locations).forEach((loc) => {
    //   locations[loc] = locations[loc].filter((user) => user.socketId !== socket.id); 
    // });
    removeUserFromAllLocation(userId, socket);
  }

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
    io.to(user.socketId).emit("getNotification", {
      receiverId: senderId, 
      senderId: receiverId
    })
  });


  socket.on("typing", (props) => {
    addUser(props.receiverId, socket.id);
    // console.log(props);
    const user = getUser(props.receiverId);
    io.to(user.socketId).emit("typing", {
      senderId: props.receiverId,
      receiverId : props.senderId,
    });
  });
  socket.on("stopTyping", (props) => {
    addUser(props.receiverId, socket.id);
    const user = getUser(props.receiverId);
    io.to(user.socketId).emit("stopTyping", {
      senderId: props.receiverId,
      receiverId : props.senderId,
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


  socket.on("addUserToLocation", ({ userId, location }) => {
    console.log("add user to location");
    addUserToLocation(userId, location, socket.id);
    console.log("locations:", locations);
    socket.join(location);
    // console.log("locations:", locations);
    // io.emit("getLocations", locations);
  });
  socket.on("removeUserFromLocation", ({ userId, location }) => {
    removeUserFromLocation({ userId, location }, socket);
    socket.leave(location);
  });

  socket.on("postNewAdInLocation", ({ user, location, ad }) => {
    console.log("post new ad in location");
    addUserToLocation(user, location, socket.id);
    socket.join(location);
    // locations[location].forEach((loc) => {
    //   console.log(loc.socketId);
    //   io.to(loc.socketId).emit("postNewAdInLocation", { user, location, ad });
    // });
    io.to(location).emit("postNewAdInLocation", { user, location, ad });
    console.log("locations:", locations);
  });


  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    removeUserFromAllLocation(socket);
    socket.leaveAll();
    io.emit("getUsers", users);
  });
});
