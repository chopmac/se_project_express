const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA,
  NOT_FOUND,
  FORBIDDEN,
  DEFAULT_ERROR,
} = require("../utils/errors");

module.exports.deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res.status(FORBIDDEN).send({ message: "You do not have permission to delete this item" });
      }

      return ClothingItem.findByIdAndRemove(itemId)
        .then(() => res.send({ message: "Item deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid item ID format" });
      }
      return res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server" });
    });
};