import { Request, Response } from "express";
import { customPayloadResponse } from "../Helpers/Helpers";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../Entities/Customer";

//  Create Customer Controller
export const createCustomerController = async (req: Request, res: Response) => {
  try {
    const { name, email, location, phone, packageId } = req.body;

    if (!name || !email || !location || !phone) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "All fields are required"));
    }

    const customer = await createCustomer(name, email, location, phone, packageId);
    return res
      .status(200)
      .json(customPayloadResponse(true, customer));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Get All Customers
// Get All or Search Customers
export const getCustomersController = async (req: Request, res: Response) => {
  try {
    const search = req.query.search ? String(req.query.search).trim() : "";

    // console.log("Search Query:", search);
    

    const customers = await getCustomers(search);

    // console.log(customers);
    

    return res
      .status(200)
      .json(customPayloadResponse(true, customers));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Internal Server Error"));
  }
};


//  Delete Customer
export const deleteCustomerController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "Customer id is required"));
    }

    const customer = await deleteCustomer(parseInt(id));
    return res
      .status(200)
      .json(customPayloadResponse(true, customer));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Internal Server Error"));
  }
};

//  Update Customer Controller
export const updateCustomerController = async (req: Request, res: Response) => {
  try {
    const { name, email, location, phone, id, packageId } = req.body;


    if (!id || !name || !email || !location || !phone) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "All fields are required"));
    }

    const customer = await updateCustomer(
      parseInt(id),
      name,
      email,
      location,
      phone,
      packageId
    );

    //console.log("Updated Customer:", customer);
    

    return res
      .status(200)
      .json(customPayloadResponse(true, customer));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Internal Server Error"));
  }
};
