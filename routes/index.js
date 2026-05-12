const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", itemRouter);

router.use(auth);


router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req, res) => {
  res.status(NOT_FOUND || 404).send({ message: "Requested resource not found" });
});

module.exports = router;