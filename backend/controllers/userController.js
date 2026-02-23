import { User } from "../models/userModel.js";
import { createJSONToken } from "../utils/token.js";

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error(req.t("user.emailExists"));
    }

    let user = new User({ name, email, password });

    if (!user) {
      res.status(400);
      throw new Error(req.t("user.invalidData"));
    }

    await user.save();

    const token = createJSONToken(user.id); /* virtual getter */

    res.status(201).json({
      message: req.t("user.registered"),
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (err) {
    next({
      message: err.message?.slice(24) ? err.message.slice(24) : req.t("user.invalidDataShort"),
    });
  }
};

export const authUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error(req.t("user.invalidEmailOrPassword"));
    }

    if (user && (await user.matchPassword(password))) {
      const token = createJSONToken(user.id); /* virtual getter */

      res.status(201).json({
        message: req.t("user.loggedIn"),
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(401);
      throw new Error(req.t("user.invalidEmailOrPassword"));
    }
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error(req.t("user.notFound"));
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: req.t("user.profileUpdated"),
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    let users = await User.find({});

    if (!users) {
      res.status(404);
      throw new Error(req.t("user.couldNotFindAny"));
    }
    res.json(users.map((user) => user.toObject({ getters: true })));
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      throw new Error(req.t("user.notFound"));
    }

    if (user.isAdmin) {
      res.status(400);
      throw new Error(req.t("user.cannotDeleteAdmin"));
    }
    await user.deleteOne();

    res.json({
      message: req.t("user.deleted"),
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    let user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error(req.t("user.notFound"));
    }
    res.json(user.toObject({ getters: true }));
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;

  const { name, email, isAdmin } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404);
      throw new Error(req.t("user.notFound"));
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = isAdmin;

    const updatedUser = await user.save();

    res.json({
      message: req.t("user.updated"),
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (err) {
    next(err);
  }
};
