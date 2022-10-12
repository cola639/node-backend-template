const auth = require("../midwares/auth");
const admin = require("../midwares/admin");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find().select("-password");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("邮箱已被使用");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(
      _.pick(user, ["_id", "name", "email", "isAdmin", "isAuthor", "avatar"])
    );
});

router.put("/:id", [auth, admin], async (req, res) => {
  user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isAuthor: true,
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send("升级成功");
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send("删除成功");
});

module.exports = router;
