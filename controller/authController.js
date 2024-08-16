const { userCollection } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const { userTokenCollection } = require("../models/userToken");
const { sendEmail } = require("../utils/emailUtils");

const registerUser = async function (req, res, next) {
  const { fname, email, password, role } = req.body;

  try {
    if (!fname || !email || !password || !role) {
      return res.status(400).send({
        message: "name, email, password and role are required.",
      });
    }

    let user = await userCollection.findOne({ email });
    if (user) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const token = v4();

    user = new userCollection({
      fname,
      email,
      password: hashedPassword,
      role,
      token,
    });

    await user.save();

    res.status(201).send({
      isSuccessful: true,
      message: `${role} created successfully`,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async function (req, res, next) {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email });
    // console.log(user);
    if (!user) {
      return res
        .status(400)
        .send({ isSuccessful: false, message: "Invalid credentials" });
    }

    const doPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!doPasswordMatch) {
      return res
        .status(400)
        .send({ isSuccessful: false, message: "Invalid credentials" });
    }

    const userToken = jwt.sign(
      {
        userId: user._id,
        fname: user.fname,
        email: user.email,
        role: user.role,
      },
      process.env.AUTH_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      isSuccessful: true,
      userDetails: {
        name: user.fname,
        email: user.email,
        role: user.role,
      },
      userToken,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({
      message: "Email is required",
    });
  }

  try {
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const token = v4();
    // await userTokenCollection.create({
    //   userId: user._id,
    //   token,
    // });
    await userTokenCollection({
      userId: user._id,
      token,
    }).save();

    await sendEmail(user.email, "Password Reset", token);

    res.status(200).send({
      isSuccessful: true,
      // user: {
      //   fullName: user.fullName,
      //   userId: user._id,
      //   uniqueId: token,
      // },
      message: "Check your email to change password",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).send({
      message: "Server error",
    });
  }
};

const resetPassword = async function (req, res, next) {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).send({
      message: "Input new password",
    });
  }

  try {
    const validToken = await userTokenCollection.findOne({ token });
    console.log(validToken);
    if (!validToken) {
      res.status(404).send({
        message: "Invalid token",
      });
      return;
    }

    const user = await userCollection.findById(validToken.userId);
    if (!user) {
      res.status(404).send({
        message: "User not found",
      });
      return;
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    // Understand this
    await validToken.deleteOne({ _id: validToken._id });

    res.status(200).send({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in reset password:", err);
    res.status(500).send({
      message: "Server error",
    });
    // next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
