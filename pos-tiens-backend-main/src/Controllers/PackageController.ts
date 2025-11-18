import { Request, Response } from "express";
import {
  getPackages,
  addPackage,
  getPackageById,
  getPackageByName,
  deletePackage,
  updatePackage,
  markPackageAsPaid,
} from "../Entities/packages";
import { customPayloadResponse } from "../Helpers/Helpers";

//  Fetch all packages
export const fetchPackages = async (req: Request, res: Response) => {
  try {
    const packages = await getPackages();
    return res
      .status(200)
      .json(customPayloadResponse(true, packages));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "An error occurred while fetching packages."));
  }
};

//  Create new package
export const createPackage = async (req: Request, res: Response) => {
  try {
    const { name, amount } = req.body;

    if (!name || !amount) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "Name and Amount are required"));
    }

    const existing = await getPackageByName(name);
    if (existing) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "Package already exists"));
    }

    await addPackage(name, amount); // ❌ Removed distributorId

    return res
      .status(201)
      .json(customPayloadResponse(true, "Package Added"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Failed to create package."));
  }
};

//  Modify package (name, amount)
export const modifyPackage = async (req: Request, res: Response) => {
  try {
    const { id, name, amount } = req.body;

    if (!id || !name || !amount) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "ID, Name, and Amount are required"));
    }

    const existing = await getPackageById(id);
    if (!existing) {
      return res
        .status(404)
        .json(customPayloadResponse(false, "Package not found"));
    }

    await updatePackage(id, name, amount); // ❌ Removed distributorId

    return res
      .status(200)
      .json(customPayloadResponse(true, "Package Updated"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Failed to update package."));
  }
};

//  Delete package
export const removePackage = async (req: Request, res: Response) => {
  try {
    const packageId = parseInt(req.params.id);
    const pkg = await getPackageById(packageId);

    if (!pkg) {
      return res
        .status(404)
        .json(customPayloadResponse(false, "Package not found"));
    }

    await deletePackage(packageId);

    return res
      .status(200)
      .json(customPayloadResponse(true, "Package Deleted"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Failed to delete package."));
  }
};

// Mark package as paid
export const payPackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "Package ID required"));
    }

    const pkg = await getPackageById(id);
    if (!pkg) {
      return res
        .status(404)
        .json(customPayloadResponse(false, "Package not found"));
    }

    await markPackageAsPaid(id);

    return res
      .status(200)
      .json(customPayloadResponse(true, "Package marked as paid"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Failed to mark package as paid."));
  }
};
