const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const donationRoute = require("./routes/donation");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/pdfs", express.static(path.join(__dirname, "/pdfs")));

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let type = req.params.type;
    let path = `${type}`;
    callback(null, path);
  },
  filename: (req, file, callback) => {
    callback(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload/:type", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/donation", donationRoute);


app.listen(process.env.PORT || "5000", () => {
  console.log("Backend is running on port 5000");
});
