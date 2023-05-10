const router = require("express").Router();

const auth = require("../middleware/auth");
const { createPost, updatePost, deletePost, getPosts, getAllPosts } = require("../controllers/posts");

//CREATE POST
router.post("/", auth, createPost );

//UPDATE POST
router.put("/:id", auth, updatePost);

//DELETE POST
router.delete("/:id", auth, deletePost );

//GET POST
router.get("/:id", getPosts);

//GET ALL POSTS
router.get("/", getAllPosts);

module.exports = router;
