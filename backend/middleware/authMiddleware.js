import { validateJSONToken } from "../utils/token.js";

import { User } from "../models/userModel.js";

export const protect = async (req, res, next) => {
  if (req.method === "options") {
    return next();
  }

  try {
    if (!req.headers.authorization) {
      console.log("Not authenticated, auth header missing");
      res.status(401);
      throw new Error(req.t("auth.notAuthenticated"));
    }

    const authFragments = req.headers.authorization.split(" ");

    if (authFragments.length !== 2) {
      console.log("Not authenticated, auth header invalid");
      res.status(401);
      throw new Error(req.t("auth.notAuthenticated"));
    }

    const authToken = authFragments[1];

    const validatedToken = validateJSONToken(authToken);

    req.user = await User.findById(validatedToken.userId).select("-password");
    req.ln = req.language;

    if (!req.user) {
      res.status(401);
      throw new Error(req.t("auth.noAuthorization"));
    }
  } catch (error) {
    console.log("Not authenticated:", error.message);
    return next(error);
  }
  next();
};

export const admin = (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error(req.t("auth.noAdmin"));
    }
  } catch (error) {
    next(error);
  }
};
