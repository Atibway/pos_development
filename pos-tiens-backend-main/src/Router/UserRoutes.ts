import { Router } from "express";

import {
  fetchUsers,
  createUserMember,
  removeUser,
  modifyUser,
  updateUserPasswordHandler,
  fetchUserById,
  updateUserProfileHandler,
  updateUserProfilePictureHandler,
} from "../Controllers/UserController";

import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { withActivityLog } from "../Middlewares/ActivityLoggerMiddleware";

import multer from "multer";

const storage = multer.diskStorage({
  destination: "useruploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const profilePictureUpload = upload.single("profile_picture");

export default (router: Router) => {
  const userPrefix = "/staff";

  // Get all users
  router.get(`${userPrefix}`,  JWTAuthMiddleWare,  fetchUsers);

  // Create new user
  router.post(
    `${userPrefix}`,
     JWTAuthMiddleWare,
    withActivityLog("Creating New User", (req) => req.body, createUserMember)
  );

  // Update user
  router.put(
    `${userPrefix}`,
     JWTAuthMiddleWare,
    withActivityLog("Modifying User", (req) => req.body, modifyUser)
  );

  // Delete user
  router.delete(
    `${userPrefix}/:id`,
     JWTAuthMiddleWare,
    withActivityLog("Removing User", (req) => req.body, removeUser)
  );

  // Reset password
  router.post(
    `${userPrefix}/reset-password`,
     JWTAuthMiddleWare,
    withActivityLog("Resetting Password", (req) => req.body, updateUserPasswordHandler)
  );

  // Get user by ID
  router.get(`${userPrefix}/:id`,  JWTAuthMiddleWare, fetchUserById);

  // Update profile
  router.put(
    `${userPrefix}/profile/:id`,
     JWTAuthMiddleWare,
      JWTAuthMiddleWare,
    withActivityLog("Updating Profile", (req) => req.body, updateUserProfileHandler)
  );

  // Upload profile picture
  router.post(
    `${userPrefix}/profile-picture/:id`,
    profilePictureUpload,
     JWTAuthMiddleWare,
    withActivityLog("Uploading Profile Picture", (req) => req.body, updateUserProfilePictureHandler)
  );
};
