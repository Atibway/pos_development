import type { Request, Response } from "express"

import {
  getStocks,
  updateStock,
  createStock,
  deleteStock,
  getSingleStock,
  restock,
  searchStock,
  getAllStocks,
  getTopStocks,
  getHalfPriceStocks,
} from "../Entities/Stock"
import { Shop } from "../Entities/Shop"

import { customPayloadResponse } from "../Helpers/Helpers"

export const fetchStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await getStocks()
    return res.status(200).json(customPayloadResponse(true, stocks))
  } catch (error) {
    console.error(error)
    return res.status(500).json(customPayloadResponse(false, "Server error"))
  }
}

export const addStock = async (req: Request, res: Response) => {
  try {
    const { productCode, description, price, qty, pv, bv, date, categoryId, name, purchasePrice, halfPrice } = req.body

    if (
      !productCode ||
      !description ||
      price == null ||
      qty == null ||
      pv == null ||
      bv == null ||
      !date ||
      !categoryId ||
      purchasePrice == null
    ) {
      return res.status(400).json(customPayloadResponse(false, "All fields are required"))
    }

    const stock = await createStock(
      productCode,
      description,
      Number(price),
      Number(purchasePrice),
      Number(qty),
      Number(pv),
      Number(bv),
      date,
      Number(categoryId),
      name,
      halfPrice || false,
    )

    if (!stock) {
      return res.status(500).json(customPayloadResponse(false, "Failed to create Stock"))
    }

    return res.status(201).json(customPayloadResponse(true, "Stock Added"))
  } catch (error) {
    console.error(error)
    return res.status(500).json(customPayloadResponse(false, "Server error"))
  }
}

export const modifyStock = async (req: Request, res: Response) => {
  try {
    const { id, productCode, description, price, qty, pv, bv, date, categoryId, name, purchasePrice, halfPrice } = req.body

    if (!id) {
      return res.status(400).json(customPayloadResponse(false, "Stock ID Required"))
    }

    if (
      !productCode ||
      !description ||
      price == null ||
      qty == null ||
      pv == null ||
      bv == null ||
      !date ||
      !categoryId
    ) {
      return res.status(400).json(customPayloadResponse(false, "All fields are required"))
    }

    const stockExists = await getSingleStock(id)
    if (!stockExists) {
      return res.status(404).json(customPayloadResponse(false, "Stock Not Found"))
    }

    await updateStock(
      id,
      productCode,
      description,
      Number(price),
      Number(qty),
      Number(pv),
      Number(bv),
      date,
      Number(categoryId),
      name,
      purchasePrice,
      halfPrice
    )

    // If halfPrice status changed, update it in all shops that have this stock
    if (halfPrice !== stockExists.halfPrice) {
      const shopsWithStock = await Shop.find();
      for (const shop of shopsWithStock) {
        if (shop.issuedStocks && shop.issuedStocks.length > 0) {
          const stockIndex = shop.issuedStocks.findIndex(issuedStock => issuedStock.stockId === id);
          if (stockIndex !== -1) {
            shop.issuedStocks[stockIndex].halfPrice = halfPrice;
            shop.issuedStocks[stockIndex].price = Number(price);
            shop.issuedStocks[stockIndex].pv = Number(pv);
            shop.issuedStocks[stockIndex].bv = Number(bv);
            await shop.save();
          }
        }
      }
    }

    return res.status(200).json(customPayloadResponse(true, "Stock Updated"))
  } catch (error) {
    console.error(error)
    return res.status(500).json(customPayloadResponse(false, "Server error"))
  }
}

export const removeStock = async (req: Request, res: Response) => {
  try {
    const stockId = Number(req.params.id)

    if (!stockId) {
      return res.status(400).json(customPayloadResponse(false, "Stock ID Required"))
    }

    const stockToDelete = await getSingleStock(stockId)

    if (!stockToDelete) {
      return res.status(404).json(customPayloadResponse(false, "Stock Not Found"))
    }

    // Find all shops that have this stock and remove it
    const shops = await Shop.find();
    let shopsUpdated = 0;

    for (const shop of shops) {
      if (shop.issuedStocks && shop.issuedStocks.length > 0) {
        const originalLength = shop.issuedStocks.length;
        shop.issuedStocks = shop.issuedStocks.filter(issuedStock => issuedStock.stockId !== stockId);
        
        if (shop.issuedStocks.length !== originalLength) {
          await shop.save();
          shopsUpdated++;
          console.log(`Removed stock ID ${stockId} from shop "${shop.name}" (ID: ${shop.id})`);
        }
      }
    }

    // Delete the stock from main inventory
    await deleteStock(stockId)
    
    const message = shopsUpdated > 0 
      ? `Stock deleted and removed from ${shopsUpdated} shop(s)`
      : "Stock deleted";

    return res.status(200).json(customPayloadResponse(true, message))
  } catch (error) {
    console.error(error)
    return res.status(500).json(customPayloadResponse(false, "Server error"))
  }
}

export const handleRestock = async (req: Request, res: Response) => {
  try {
    const { id, qty, price, pv, bv, date, halfPrice } = req.body

    if (!id || qty == null || price == null || pv == null || bv == null || !date) {
      return res.status(400).json(customPayloadResponse(false, "All fields are required for restock"))
    }

    const stock = await restock(Number(id), Number(qty), Number(price), Number(pv), Number(bv), date, halfPrice)

    return res.status(200).json(customPayloadResponse(true, stock))
  } catch (error) {
    console.error(error)
    return res.status(500).json(customPayloadResponse(false, "Server error"))
  }
}

export const handleSearchStock = async (req: Request, res: Response) => {
  try {
    // Fix: Accept both 'search' and 'searchTerm' for compatibility
    const { search, searchTerm, category, categoryId, minPrice, maxPrice, halfPrice } = req.query

    // Use searchTerm if available, fallback to search
    const searchQuery = searchTerm || search
    const categoryQuery = categoryId || category

    console.log('Search params received:', {
      searchQuery,
      categoryQuery,
      minPrice,
      maxPrice,
      halfPrice
    })

    const stocks = await searchStock(
      searchQuery ? searchQuery.toString().trim() : null,
      categoryQuery ? Number.parseInt(categoryQuery.toString()) : null,
      minPrice ? Number.parseFloat(minPrice.toString()) : null,
      maxPrice ? Number.parseFloat(maxPrice.toString()) : null,
      halfPrice !== undefined ? halfPrice === 'true' : null,
    )

    console.log(`Search returned ${stocks.length} results`)

    return res.status(200).json(customPayloadResponse(true, stocks))
  } catch (error) {
    console.error('Search error:', error)
    return res.status(500).json(customPayloadResponse(false, "Server error"))
  }
}

export const handleGetAllStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await getAllStocks() // This now only returns regular stock (halfPrice: false)
    return res.status(200).json(customPayloadResponse(true, stocks))
  } catch (error) {
    console.error(error)
    return res.status(500).json(customPayloadResponse(false, "Server error"))
  }
}

export const handleGetTopStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await getTopStocks()
    return res.status(200).json(customPayloadResponse(true, stocks))
  } catch (error) {
    console.error(error)
    return res.status(500).json(customPayloadResponse(false, "Server error"))
  }
}

export const handleGetHalfPriceStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await getHalfPriceStocks() // This only returns half-price stock (halfPrice: true)
    return res.status(200).json(customPayloadResponse(true, stocks))
  } catch (error) {
    console.error(error)
    return res.status(500).json(customPayloadResponse(false, "Server error"))
  }
}