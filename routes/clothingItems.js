const router = require("express").Router();
const {
  getItems,
  createItem,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;