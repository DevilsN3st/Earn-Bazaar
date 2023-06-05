const router = require("express").Router();
const {
  addNewNotification,
  deleteNotification,
  getNotification,
} = require("../controllers/notification");
const auth = require("../middleware/auth");

router.get("/:notificationId", auth, getNotification);
router.post("/", auth, addNewNotification)
router.delete("/:notificationId", auth, deleteNotification);

module.exports = router;
