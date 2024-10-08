const Users = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Category = require("../model/category.model");

exports.signUpUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new Users({ name, email, hashedPassword });
    newUser
      .save()
      .then((user) => {
        res.status(201).send({ message: "User created successfully" });
      })
      .catch((error) => {
        res
          .status(500)
          .send({ message: "Error creating user", error: error.message });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await Users.findOne({ email });
    if (!userExist) {
      return res.status(400).send({ message: "Email does not exist" });
    }
    const isValidPassword = bcrypt.compareSync(
      password,
      userExist.hashedPassword
    );
    if (isValidPassword) {
      const token = jwt.sign({ userId: userExist._id }, process.env.SECRET_KEY);
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 86400000),
      });
      res.status(200).send({ message: "Login successful", user: userExist });
    } else {
      res.status(400).send({ message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.logoutUser = (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;
    const existingCategory = await Category.findOne({ name, userId });
    if (existingCategory) {
      return res.status(400).send({ message: "Category already exists" });
    }
    const newCategory = new Category({
      name,
      userId,
    });
    await newCategory
      .save()
      .then((data) => {
        res.status(200).send({ message: "Category added successfully", data });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Internal server error", error: err.message });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const userId = req.userId;
    const userCategories = await Category.find({ userId });
    const defaultCategories = [
      "grocery",
      "electronics",
      "food",
      "transport",
      "other",
      "healthcare",
      "utilities",
      "savings",
      "subscriptions",
    ];

    res.status(200).send({
      message: "Categories fetched successfully",
      categories: [...defaultCategories, ...userCategories.map((c) => c.name)],
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};
