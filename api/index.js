const express = require("express");
const app = express();
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const donationRoute = require("./routes/donation");
const tagsRoute = require("./routes/tags");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { storage } = require("./config/storage");


dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "/public")));

connectDB();

const upload = multer({ storage: storage });

app.post("/api/upload/:type", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/tags", tagsRoute);
app.use("/api/messages", messageRoute);
app.use("/api/donation", donationRoute);


app.listen(process.env.PORT || "5000", () => {
  console.log("Backend is running on port 5000");
});
