import { Request, Response } from "express";
import {
  getCategories,
  addCategories,
  deleteCategories,
  updateCategories,
  getCategoriesById,
} from "../Entities/Category";
import { customPayloadResponse } from "../Helpers/Helpers";

export const fetchCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    return res.json(customPayloadResponse(true, categories)).status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const createCategories = async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    // const findType = await getCategoriesById(type);
    // if (findType) {
    //   return res.json(customPayloadResponse(false, "category Exists"));
    // }
    const insertType = await addCategories(type);
    if (insertType) {
      return res
        .json(customPayloadResponse(true, "categories Added"))
        .status(200)
        .end();
    } else {
      return res
        .json(customPayloadResponse(false, "Failed to add categories"))
        .status(400)
        .end();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const modifyCategories = async (req: Request, res: Response) => {
  try {
    const { type, id } = req.body;
    if (!type) {
      return res
        .json(customPayloadResponse(false, "Categories Required"))
        .status(200)
        .end();
    }
    if (!id) {
      return res
        .json(customPayloadResponse(false, "Categories Id Required"))
        .status(200)
        .end();
    }
    const categoriesUpdate = await getCategoriesById(id);
    if (categoriesUpdate) {
      await updateCategories(id, type);
      return res
        .json(customPayloadResponse(true, "categories Updated"))
        .status(200)
        .end();
    }
    return res
      .json(customPayloadResponse(false, "Categories"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

export const removeCategories = async (req: Request, res: Response) => {
  try {
    const categoryIdId = parseInt(req.params.id);
    const category = await getCategoriesById(categoryIdId);
    if (category) {
      await deleteCategories(categoryIdId);
      return res
        .json(customPayloadResponse(true, "category Deleted"))
        .status(200)
        .end();
    }
    return res
      .json(customPayloadResponse(false, "categoryIdId not Found"))
      .status(200)
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};
