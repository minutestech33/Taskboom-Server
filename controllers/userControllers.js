const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.userRegister = async (req, res) => {
  try {
    const { fullname, username, email, password, profile } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);
    const createNewUser = await User({
      fullname,
      username,
      email,
      password: hasedPassword,
      profile,
    });
    const saveNewUser = await createNewUser.save();

    if (saveNewUser) {
      const token = jwt.sign(
        {
          username,
          userId: saveNewUser._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );
      return res.status(200).json({
        msg: "User created successfully.",
        token,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

exports.userLogin = async (req, res) => {
  try {
    let user;
    const { emailorusername } = req.body;
    if (/\S+@\S+\.\S+/.test(emailorusername)) {
      user = await User.findOne({ email: emailorusername });
    } else {
      user = await User.findOne({ username: emailorusername });
    }
    const token = jwt.sign(
      {
        username: user.username,
        userId: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      msg: "Login successful.",
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser) {
      const token = jwt.sign(
        {
          username: findUser.username,
          userId: findUser._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );
      return res.status(200).json({
        msg: "User found!",
        token,
      });
    } else {
      const newUser = await User(req.body);
      const saveNewUser = await newUser.save();
      const token = jwt.sign(
        {
          username: saveNewUser.username,
          userId: saveNewUser._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );
      if (saveNewUser) {
        return res.status(200).json({
          msg: "User created successfully.",
          token,
        });
      } else {
        return res.status(400).json({
          msg: "Account creation failed.",
          token,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        res.status(200).json({
            user
        });
    } catch(err) {
        console.log(err);
    }
}
