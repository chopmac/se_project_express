const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const {
  INVALID_DATA,
  NOT_FOUND,
  DEFAULT_ERROR,
} = require("../utils/errors");

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid user ID format" });
      }
      return res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server" });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data passed" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      })
    )
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res.status(409).send({ message: "A user with this email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Invalid data passed" });
      }
      return res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server" });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(INVALID_DATA).send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res.status(401).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server" });
    });
};