const { JWT_SECRET = "super-strong-secret-key" } = process.env;

module.exports = {
  JWT_SECRET,
};