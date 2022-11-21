var express = require("express");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "SECRET_KEY";

var router = express.Router();

router.get("/all", async (req, res) => {
  const users = await res.users.find().sort({ createdAt: -1, _id: 1 });
  console.log("users-list", users);
  const usersList = [];
  await users.forEach(({ email, name, bio, profileUrl, _id: id }) =>
    usersList.push({ email, name, bio, profileUrl, id })
  );
  return res.json(usersList);
});

router.post("/signup", async (req, res) => {
  try {
    console.log("req-body", req.body);
    const { email, password, name, bio, profileUrl } = req.body;
    const user = await res.users.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "A user already exists, please login." });
    }
    const { insertedId } = await res.users.insertOne({
      email,
      password: await bcrypt.hash(password, 10),
      name,
      bio,
      profileUrl,
      createdAt: new Date(),
    });
    // const user = await res.users.findOne({ email });
    const jwt_token = jwt.sign({ id: insertedId }, SECRET_KEY, {
      expiresIn: "30d",
    });
    console.log("new-user", insertedId, jwt_token);
    return res.status(201).json({ jwt_token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: err?.message ?? "Internal server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await res.users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid password" });
    }
    return res.json({
      jwt_token: jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "30d" }),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.use(async (req, res, next) => {
  try {
    const jwt_token = req.headers.authorization.split(" ")[1];
    const { id } = jwt.verify(jwt_token, SECRET_KEY);
    const user = await res.users.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error("User does not exist in the database, please sign up.");
    }
    res.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ message: err?.message ?? "Invalid jwt token." });
  }
});

router.get("/", async (req, res) => {
  const { email, name, _id: id, profileUrl, bio } = res.user;
  return res.json({ email, name, id, profileUrl, bio });
});

router.put("/", async (req, res) => {
  const user = res.user;
  const {
    name = user.name,
    bio = user.bio,
    profileUrl = user.profileUrl,
  } = req.body;
  console.log("req-body", req.body, user, name);
  const u = await res.users.updateOne(
    { _id: user._id },
    { $set: { name, bio, profileUrl } }
  );
  console.log("value", u);
  const updatedUser = await res.users.findOne({ _id: user._id });

  return res.json({
    name: updatedUser.name,
    bio: updatedUser.bio,
    profileUrl: updatedUser.profileUrl,
    email: updatedUser.email,
    id: updatedUser._id,
  });
});

module.exports = router;
