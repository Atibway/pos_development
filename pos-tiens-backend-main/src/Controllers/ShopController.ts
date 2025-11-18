require("dotenv").config()
import type { Request, Response } from "express"
import { customPayloadResponse } from "../Helpers/Helpers"
import {
  getShops,
  createShop,
  deleteShop,
  updateShop,
  assignStocksToShop,
  removeStockFromShop,
  getShopsWithIssuedStockByUser,
  clearStocksFromShop,
} from "../Entities/Shop"

// GET /shops
export const fetchShops = async (req: Request, res: Response) => {
  try {
    const shops = await getShops()
  
    
    return res.status(200).json(customPayloadResponse(true, shops))
  } catch (err) {
    console.error(err)
    return res.status(500).json(customPayloadResponse(false, "Failed to fetch shops"))
  }
}

// Controller functions

export const HandleCreateShop = async (req: Request, res: Response) => {
  try {
    const { name, serialNumber, contact, location, userId } = req.body;
console.log(
  name, serialNumber, contact, location, userId
);

    if (!name || !serialNumber || !contact || !location || !userId) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "Missing required fields"));
    }


    
    const newShop = await createShop(name, serialNumber, contact, location, userId);
    return res.status(201).json(customPayloadResponse(true, newShop));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(customPayloadResponse(false, (err as Error).message));
  }
};

export const HandleUpdateShop = async (req: Request, res: Response) => {
  try {
    const { shopId, name, serialNumber, contact, location, userId } = req.body;

    const id = Number.parseInt(shopId, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "Invalid shopId"));
    }

    const updated = await updateShop(
      id,
      name,
      serialNumber,
      contact,
      location,
      userId
    );
    return res.status(200).json(customPayloadResponse(true, updated));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(customPayloadResponse(false, (err as Error).message));
  }
};


// POST /shops/:id (delete)
export const removeShop = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id, 10)

    console.log(id)

    if (isNaN(id)) {
      return res.status(400).json(customPayloadResponse(false, "Invalid shop id"))
    }
    await deleteShop(id)
    return res.status(200).json(customPayloadResponse(true, "Shop Deleted"))
  } catch (err) {
    console.error(err)
    return res.status(500).json(customPayloadResponse(false, (err as Error).message))
  }
}

// POST /shops/assign-stocks
export const HandleAssignStocks = async (req: Request, res: Response) => {
  try {
    const shopId = Number.parseInt(req.body.shopId, 10)
    if (isNaN(shopId)) {
      return res.status(400).json(customPayloadResponse(false, "Invalid shopId"))
    }

    const stockItems = req.body.stockItems
    if (!Array.isArray(stockItems) || stockItems.length === 0) {
      return res.status(400).json(customPayloadResponse(false, "stockItems required"))
    }

    const sanitized = stockItems.map((it: any) => {
      const id = Number.parseInt(it.id, 10)
      const qty = Number.parseInt(it.quantity, 10)
      return { id, quantity: qty }
    })

    if (sanitized.some((it: any) => isNaN(it.id) || isNaN(it.quantity))) {
      return res.status(400).json(customPayloadResponse(false, "Invalid ID or quantity in stockItems"))
    }

    const result = await assignStocksToShop(shopId, sanitized)
    return res.status(200).json(customPayloadResponse(true, result))
  } catch (err) {
    console.error(err)
    return res.status(500).json(customPayloadResponse(false, (err as Error).message))
  }
}

// POST /shops/remove-stock
export const HandleRemoveStockFromShop = async (req: Request, res: Response) => {
  try {
    const shopId = Number.parseInt(req.body.shopId, 10)
    const stockId = Number.parseInt(req.body.stockId, 10)
    if (isNaN(shopId) || isNaN(stockId)) {
      return res.status(400).json(customPayloadResponse(false, "Invalid shopId or stockId"))
    }
    const result = await removeStockFromShop(shopId, stockId)
    return res.status(200).json(customPayloadResponse(true, result))
  } catch (err) {
    console.error(err)
    return res.status(500).json(customPayloadResponse(false, (err as Error).message))
  }
}

// GET /shops/:id/stocks
export const HandleGetShopStockByUserId = async (req: Request, res: Response) => {
  try {
    const userId = Number.parseInt(req.params.id, 10)
   

    if (isNaN(userId)) {
      return res.status(400).json(customPayloadResponse(false, "Invalid shop ID"))
    }
    const stocks = await getShopsWithIssuedStockByUser(userId)
    return res.status(200).json(customPayloadResponse(true, stocks))
  } catch (err) {
    console.error(err)
    return res.status(500).json(customPayloadResponse(false, (err as Error).message))
  }
}

// POST /shops/:id/clear-stocks
export const HandleClearStocksFromShop = async (req: Request, res: Response) => {
  try {
    const shopId = Number.parseInt(req.params.id, 10)
    if (isNaN(shopId)) {
      return res.status(400).json(customPayloadResponse(false, "Invalid shop ID"))
    }
    const result = await clearStocksFromShop(shopId)
    return res.status(200).json(customPayloadResponse(true, result))
  } catch (err) {
    console.error(err)
    return res.status(500).json(customPayloadResponse(false, (err as Error).message))
  }
}
