require("dotenv").config();
import { Request, Response } from "express";

import {
  customPayloadResponse,
  randomStringGenerator,
  hashPassword,
  sendingMail,
} from "../Helpers/Helpers";

import {
  getUsers,
  addUser,
  deleteUser,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserPassword,
  updateUserProfile,
  updateUserProfilePicture,
} from "../Entities/user";

// Fetch all users
export const fetchUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    return res.json(customPayloadResponse(true, users)).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Create a new user
export const createUserMember = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, middleName, roles } = req.body;

    if (!firstName || !lastName || !email) {
      return res
        .json(customPayloadResponse(false, "First Name, Last Name, and Email are required"))
        .status(200)
        .end();
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .json(customPayloadResponse(false, "Email already taken"))
        .status(200)
        .end();
    }

    const password = "12345678";
    const hashedPassword = await hashPassword(password, 10);

    const newUser = await addUser(
      email,
      lastName,
      firstName,
      middleName,
      hashedPassword,
      roles
    );

    if (newUser) {
      const mailOptions = {
        to: email,
        subject: "Temporary Password",
        template: "Email",
        context: {
          body: `Hey ${firstName} ${middleName} ${lastName}, Below is your temporary password.`,
          data: password,
        },
      };

      sendingMail(mailOptions);
      return res.json(customPayloadResponse(true, "User added")).status(200).end();
    } else {
      return res
        .json(customPayloadResponse(false, "Failed to add user"))
        .status(200)
        .end();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Delete a user
export const removeUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUserById(userId);
    if (user) {
      await deleteUser(userId);
      return res.json(customPayloadResponse(true, "User deleted")).status(200).end();
    }
    return res.json(customPayloadResponse(false, "User not found")).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Update user
export const modifyUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      middleName,
      userId,
      roles,
      isRemove,
    } = req.body;

    // Removed console.log of sensitive user information
    

    if (!firstName || !lastName || !email || !userId) {
      return res
        .json(customPayloadResponse(false, "Required fields missing"))
        .status(200)
        .end();
    }

    const user = await getUserById(userId);
    if (user) {
      const currentRoles = user.roles || [];
      let updatedRoles: string[];

      if (isRemove) {
        updatedRoles = currentRoles.filter((role) => role !== roles);
      } else {
        updatedRoles = [...currentRoles, roles];
      }

      const updatedUser = await updateUser(
        userId,
        email,
        lastName,
        firstName,
        middleName,
        updatedRoles
      );

      if (updatedUser) {
        return res.json(customPayloadResponse(true, "User updated")).status(200).end();
      }
    }

    return res.json(customPayloadResponse(false, "User not found")).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Update password
export const updateUserPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { password, confirm_password, email } = req.body;

    if (!password || !confirm_password || !email) {
      return res
        .json(customPayloadResponse(false, "All fields are required"))
        .status(200)
        .end();
    }

    if (password !== confirm_password) {
      return res
        .json(customPayloadResponse(false, "Password mismatch"))
        .status(200)
        .end();
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .json(customPayloadResponse(false, "User not found"))
        .status(200)
        .end();
    }

    const hashedPwd = await hashPassword(password, 10);
    await updateUserPassword(email, hashedPwd);

    return res.json(customPayloadResponse(true, "Password updated")).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Get user by ID
export const fetchUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .json(customPayloadResponse(false, "User ID required"))
        .status(200)
        .end();
    }

    const user = await getUserById(parseInt(id));
    if (user) {
      return res.json(customPayloadResponse(true, user)).status(200).end();
    }

    return res.json(customPayloadResponse(false, "User not found")).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Update user profile
export const updateUserProfileHandler = async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      email,
      gender,
      address,
      phone_number,
      date_of_birth,
      marital_status,
      nationality,
      user_type,
    } = req.body;

    const { id } = req.params;
    if (!id) {
      return res
        .json(customPayloadResponse(false, "User ID required"))
        .status(200)
        .end();
    }



    const updated = await updateUserProfile(
      parseInt(id),
      first_name,
      middle_name,
      last_name,
      email,
      address,
      phone_number,
      date_of_birth,
      gender,
      marital_status,
      nationality
    );

    if (updated) {
      return res.json(customPayloadResponse(true, "Profile updated")).status(200).end();
    }

    return res.json(customPayloadResponse(false, "User not found")).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Update user profile picture
export const updateUserProfilePictureHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res
        .json(customPayloadResponse(false, "Profile picture required"))
        .status(200)
        .end();
    }

    if (!id) {
      return res
        .json(customPayloadResponse(false, "User ID required"))
        .status(200)
        .end();
    }

    const photo = req.file.filename;
    const user = await updateUserProfilePicture(parseInt(id), photo);

    if (user) {
      return res.json(customPayloadResponse(true, "Profile picture updated")).status(200).end();
    }

    return res.json(customPayloadResponse(false, "User not found")).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};
