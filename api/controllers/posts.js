const Post = require("../models/Post");
const Tags = require("../models/Tags");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const createPost = async (req, res) => {
  try {
    const tempId = uuidv4();
    const newPost = new Post({ ...req.body, id: tempId, userId: req.userId });

    console.log("writing post");

    req.body.tags.forEach((tag) => {
      Tags.findOne({ name: tag.label }).then((doc) => {
        if (!doc) {
          const newTag = new Tags({
            name: tag.label,
            tagId: tag.id,
            postId: [tempId],
          });
          newTag.save();
        } else {
          doc.updateOne({ $push: { postId: tempId } }).then(() => {
            console.log("updated");
          });
        }
      });
    })

    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

 const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.userId || post.userId !== req.userId)
      return res
        .status(401)
        .json("NOT Validated in order to perform the changes");
    console.log("working");
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        req.body.tags.forEach((tag) => {
          Tags.findOne({ name: tag.label }).then((doc) => {
            if (!doc) {
              const newTag = new Tags({
                name: tag.label,
                tagId: tag.id,
                postId: post.id,
              });
              newTag.save();
            } else {
              doc.updateOne({ $push: { postId: tempId } }).then(() => {
                console.log("updated");
              });
            }
          });
        })
        return res.status(200).json(updatedPost);
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

 const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!req.userId || post.userId !== req.userId) {
      return res.status(401).json("not validated");
    }

    if (post.username === req.body.username) {
      try {
        await post.delete();
        return res.status(200).json("Post has been deleted...");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

 const getPosts = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
};

 const getAllPosts = async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
};



module.exports = { createPost, updatePost, deletePost, getPosts, getAllPosts};