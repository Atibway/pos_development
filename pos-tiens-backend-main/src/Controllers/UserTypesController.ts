import { Request, Response } from "express";

import {
  getUserTypes,
  addUserType,
  deleteUserType,
  updateUserType,
  getUserTypeById,
  getUserTypeByType,
} from "../Entities/UserType";

import { customPayloadResponse } from "../Helpers/Helpers";

// Fetch all user types
export const fetchUserTypes = async (req: Request, res: Response) => {
  try {
    const userTypes = await getUserTypes();
    return res.json(customPayloadResponse(true, userTypes)).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Create new user type
export const createUserType = async (req: Request, res: Response) => {
  try {
    const { userType } = req.body;
    const findType = await getUserTypeByType(userType);
    if (findType) {
      return res.json(customPayloadResponse(false, "Type already exists"));
    }

    const insertType = await addUserType(userType);
    if (insertType) {
      return res
        .json(customPayloadResponse(true, "User type added successfully"))
        .status(200)
        .end();
    } else {
      return res
        .status(400)
        .json(customPayloadResponse(false, "Failed to add user type"));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Update user type
export const modifyUserType = async (req: Request, res: Response) => {
  try {
    const { userType, typeId } = req.body;

    if (!userType) {
      return res
        .json(customPayloadResponse(false, "User type is required"))
        .status(200)
        .end();
    }

    if (!typeId) {
      return res
        .json(customPayloadResponse(false, "User type ID is required"))
        .status(200)
        .end();
    }

    const typeToUpdate = await getUserTypeById(typeId);
    if (typeToUpdate) {
      await updateUserType(typeId, userType);
      return res
        .json(customPayloadResponse(true, "User type updated successfully"))
        .status(200)
        .end();
    }

    return res
      .json(customPayloadResponse(false, "User type not found"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};


// Delete user type
export const removeUserType = async (req: Request, res: Response) => {
  try {
    const userTypeId = parseInt(req.params.id);
    const userType = await getUserTypeById(userTypeId);

    if (userType) {
      await deleteUserType(userTypeId);
      return res
        .json(customPayloadResponse(true, "User type deleted successfully"))
        .status(200)
        .end();
    }

    return res
      .json(customPayloadResponse(false, "User type not found"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};
