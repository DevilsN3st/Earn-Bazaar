const router = require("express").Router();

const { updateUser, deleteUser, getUser, getPostOfUser, getFriendsOfUser, followUser, unfollowUser } = require("../controllers/users")

//UPDATE
router.put("/:id", updateUser );

//DELETE
router.delete("/:id", deleteUser);

//GET USER

router.get("/", getUser);

//GET POST OF USER
router.get("/profile/:user", getPostOfUser);

//get friends
router.get("/friends/:userId", getFriendsOfUser);

//follow a user

router.put("/:id/follow", followUser);

//unfollow a user

router.put("/:id/unfollow", unfollowUser);


module.exports = router;
