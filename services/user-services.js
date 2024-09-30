const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  fetchUser,
  createUser,
  fetchUsersFullNameData,
} = require("../data/user-data");
const UserModel = require("../models/UserModel");
const {
  createRefreshTokenData,
  fetchRefreshTokenData,
  deleteRefreshTokenData,
} = require("../data/refreshToken-data");

exports.getRefreshToken = async (userId) => {
  return await fetchRefreshTokenData(userId);
};

exports.refreshToken = async (body, res) => {
  const refreshToken = body.token;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  const { id } = jwt.decode(refreshToken);
  const existingRefreshToken = await fetchRefreshTokenData(id);

  if (!existingRefreshToken)
    return res.status(403).json({ message: "Invalid token" });

  let accessToken;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    const { iat, ...userWithNoIat } = user;
    if (err) return res.status(403).json({ message: "Invalid token" });
    accessToken = jwt.sign(userWithNoIat, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  });

  return { accessToken };
};

exports.login = async (body, res) => {
  try {
    const user = await fetchUser({ key: UserModel.email, value: body.email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User does not exist!" });
    } else {
      const correctPassword = await bcrypt.compare(
        body.password,
        user.password
      );
      if (!correctPassword) {
        return res
          .status(401)
          .json({ status: "fail", message: "Wrong email or password" });
      }
    }

    const { password, ...userWithoutPassword } = user;

    const accessToken = jwt.sign(
      userWithoutPassword,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    let refreshToken;
    const existingRefreshToken = await fetchRefreshTokenData(user.id);

    if (!existingRefreshToken) {
      refreshToken = jwt.sign(
        userWithoutPassword,
        process.env.REFRESH_TOKEN_SECRET
      );
      await createRefreshTokenData(user.id, refreshToken);
    }

    return { user: userWithoutPassword, accessToken };
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: "Something went wrong" });
  }
};

exports.signin = async (body) => {
  return await createUser(body);
};

exports.logout = async (body) => {
  return await deleteRefreshTokenData(body.user_id);
};
