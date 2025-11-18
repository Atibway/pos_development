require("dotenv").config();
import crypto from "crypto";
import { Response, Request } from "express";

import {
  createNewToken,
  findByEmail,
  deleteToken,
  findByCode,
} from "../Entities/PasswordReset";
import {
  validatePassword,
  customPayloadResponse,
  getAuthAccessToken,
  decodeToken,
  setTokenExpiryToZero,
  invalidateToken,
  randomStringGenerator,
  sendingMail,
} from "../Helpers/Helpers";
import { saveActivityLog } from "../Entities/ActivityLogs";
import { getUserByEmail, getUserById } from "../Entities/user";

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;


    if (!email) {
      return res
        .json(customPayloadResponse(false, "Email Required"))
        .status(200)
        .end();
    }

    if (!password) {
      return res
        .json(customPayloadResponse(false, "Password Required"))
        .status(200)
        .end();
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .json(customPayloadResponse(false, "Incorrect Email or Password"))
        .status(200)
        .end();
    } else {
      const validatedPassword = await validatePassword(password, user.password);

      const findUserById = await getUserById(user.id);

      if (!validatedPassword) {
        return res
          .json(customPayloadResponse(false, "Incorrect Email or Password"))
          .status(200)
          .end();
      }

      if (findUserById) {
        // console.log('user res',findUserById);
        await saveActivityLog(findUserById.id,"Logged In","A user has just logged In");
        const accessToken = getAuthAccessToken(
          findUserById,
          process.env.ACCESS_TOKEN_SECRET
        );

        const response = {
          token: accessToken,
          user: findUserById,
        };

        return res
          .json(customPayloadResponse(true, response))
          .status(200)
          .end();
      } else {
        return res
          .json(customPayloadResponse(false, "User not found"))
          .status(200)
          .end();
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = decodeToken(token);

    const modifiedJWTLoad = setTokenExpiryToZero(decoded);

    const newToken = invalidateToken(
      modifiedJWTLoad,
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.json(customPayloadResponse(true, { logoutToken: newToken }));
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const authenticatedUser = await getUserById(req.user.id);

    return res.json(customPayloadResponse(true, authenticatedUser));
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const passwordResetRequest = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const resetToken = crypto.randomBytes(64).toString("hex");

    const code = randomStringGenerator(6);

    if (!email) {
      return res
        .json(customPayloadResponse(false, "Email Required"))
        .status(200)
        .end();
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .json(customPayloadResponse(false, "Email Does Not Exist"))
        .status(200)
        .end();
    } else {
      const findToken = await findByEmail(email);

      if (findToken) {
        await deleteToken(findToken.id);
      }
      const createToken = await createNewToken(email, resetToken, code);

      if (createToken) {
        const mailOptions = {
          to: email,
          subject: "Password Reset Code",
          template: "Email",
          context: {
            body:
              "Hey " +
              user.first_name +
              " " +
              user.middle_name +
              " " +
              user.last_name +
              ", Below is the code for password reset.",
            data: code,
          },
        };
        sendingMail(mailOptions);
        return res
          .json(
            customPayloadResponse(true, { email: email, token: resetToken })
          )
          .status(200)
          .end();
      } else {
        return res
          .json(customPayloadResponse(false, "Failed to create reset token"))
          .status(500)
          .end();
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const getCodeForReset = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .json(customPayloadResponse(false, "Code Required"))
        .status(200)
        .end();
    }
    const tokenCode = await findByCode(code);
    if (tokenCode) {
      return res
        .json(customPayloadResponse(true, { email: tokenCode.email }))
        .status(200)
        .end();
    } else {
      return res
        .json(customPayloadResponse(false, "Wrong Code"))
        .status(200)
        .end();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};
