import type { Request, Response } from "express"
import { customPayloadResponse } from "../Helpers/Helpers"
import { getSales, createSale, getSalesByDate, searchSales, getSalesAndExpenses, deleteSale, Sales } from "../Entities/Sales"
import { createLoan } from "../Entities/Loan"
import { Between } from "typeorm";
import {  MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { startOfDay, endOfDay } from "date-fns";


export const getSalesByShopAndDateController = async (req: Request, res: Response) => {
  try {
    const { shopId, date } = req.query;
    if (!shopId || !date) {
      return res.status(400).json(customPayloadResponse(false, "Shop ID and date are required"));
    }

const dateObj = new Date(date.toString())
const nextDay = new Date(dateObj)
nextDay.setDate(nextDay.getDate() + 1)

const sales = await Sales.find({
  where: {
    shop: { id: Number(shopId) },
    date: Between(dateObj, nextDay),
  },
  relations: ["stock", "shop"],
})


    return res.status(200).json(customPayloadResponse(true, sales));
  } catch (error) {
    console.error("Error fetching sales by shop and date:", error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};


export const getSalesController = async (req: Request, res: Response) => {
  try {
    const { page } = req.query
    const sales = await getSales(page ? Number.parseInt(page.toString()) : 1)
    return res.json(customPayloadResponse(true, sales)).status(200).end()
  } catch (error) {
    console.error(error)
    return res.json(customPayloadResponse(false, "Internal Server Error")).status(500).end()
  }
}

export const createSalesController = async (req: Request, res: Response) => {
  try {
    const { sales, customerId, paymentDate, loan, shopId, clientType } = req.body


    // Validate
    if (!sales || !Array.isArray(sales) || sales.length === 0) {
      return res.status(400).json(customPayloadResponse(false, "Sales must be a non-empty array"))
    }

    if (!shopId) {
      return res.status(400).json(customPayloadResponse(false, "Shop ID is required"))
    }

    if (!clientType) {
      return res.status(400).json(customPayloadResponse(false, "Client type is required"))
    }

    // Validate client type
    const validClientTypes = ["Member", "Non-Member", "Working Client", "Half-Price (HP) Client"]
    if (!validClientTypes.includes(clientType)) {
      return res.status(400).json(customPayloadResponse(false, "Invalid client type"))
    }

    // Loop over each sale item
    for (const sale of sales) {
      const { date, quantity, stockId, unitPrice, clientType: itemClientType } = sale
      if (!date || !quantity || !stockId) {
        continue // Skip incomplete entries
      }

      // Use custom unit price if provided, otherwise use stock price
      const effectivePrice = unitPrice || null
      const effectiveClientType = itemClientType || clientType

      // Case 1: Paid sale to a distributor
      if (customerId && !loan) {
        await createSale(date, quantity, stockId, customerId, null, shopId, effectivePrice, effectiveClientType)
      }

      // Case 2: Loan sale to a distributor
      else if (customerId && loan && paymentDate) {
        const newSale = await createSale(
          date,
          quantity,
          stockId,
          customerId,
          paymentDate,
          shopId,
          effectivePrice,
          effectiveClientType,
        )

        // Calculate loan amount using effective price or stock price
        const loanAmount = effectivePrice ? effectivePrice * quantity : newSale.stock.price * quantity

        await createLoan(paymentDate, loanAmount, customerId, newSale.id)
      }

      // Case 3: Outsider sale (no customer)
      else {
        await createSale(date, quantity, stockId, null, null, shopId, effectivePrice, effectiveClientType)
      }
    }

    return res.status(200).json(customPayloadResponse(true, "Sales processed successfully"))
  } catch (error) {
    console.error(error)
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"))
  }
}

export const getSalesByDateController = async (req: Request, res: Response) => {
  try {
    const { date } = req.query
    if (!date) {
      return res.json(customPayloadResponse(false, "Date Required")).status(400).end()
    }
    const sales = await getSalesByDate(date.toString())
    return res.json(customPayloadResponse(true, sales)).status(200).end()
  } catch (error) {
    console.error(error)
    return res.json(customPayloadResponse(false, "Internal Server Error")).status(500).end()
  }
}

export const searchSalesController = async (req: Request, res: Response) => {
  try {
    const { search, shop, startDate, endDate, distributor, distributorId } = req.query;

    const sales = await searchSales(
      typeof search === "string" ? search : null,
      typeof shop === "string" ? shop : null,
      typeof startDate === "string" ? startDate : null,
      typeof endDate === "string" ? endDate : null,
      typeof distributor === "string" ? distributor : null,
      typeof distributorId === "string" ? distributorId : null,
    );

    return res.status(200).json(customPayloadResponse(true, sales)).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json(customPayloadResponse(false, "Failed to search sales")).end();
  }
};



export const getSalesAndExpensesController = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query

    const salesAndExpenses = await getSalesAndExpenses(
      startDate ? startDate.toString() : null,
      endDate ? endDate.toString() : null,
    )

    return res.json(customPayloadResponse(true, salesAndExpenses)).status(200).end()
  } catch (error) {
    console.error(error)
    return res.json(customPayloadResponse(false, "Internal Server Error")).status(500).end()
  }
}

export const handleDeleteSale = async (req: Request, res: Response) => {
  try {
    const saleId = Number.parseInt(req.params.id)
    if (isNaN(saleId)) {
      return res.status(400).json({ error: "Invalid sale ID" })
    }

    await deleteSale(saleId)
    // return res.json(result)
     return res.status(200).json(customPayloadResponse(true, "Sale Deleted"))
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}



// Daily Profit and Loss Controller
export const getDailyProfitLossController = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    console.log("Date:", date);
    if (!date) return res.status(400).json(customPayloadResponse(false, "Date is required"));

    const targetDate = new Date(date.toString());
    const sales = await Sales.find({
      where: { date: Between(startOfDay(targetDate), endOfDay(targetDate)) },
      relations: ["stock"],
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.unitPrice || 0) * sale.quantity, 0);
    const totalCost = sales.reduce((sum, sale) => sum + (sale.stock.purchasePrice || 0) * sale.quantity, 0);
    const totalProfit = totalRevenue - totalCost;
console.log(
      "Daily Profit/Loss Data:",
      { date: targetDate.toDateString(), totalRevenue, totalCost, totalProfit, salesCount: sales.length }  
);

    return res.status(200).json(
      customPayloadResponse(true, {
        date: targetDate.toDateString(),
        totalRevenue,
        totalCost,
        totalProfit,
        salesCount: sales.length,
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(customPayloadResponse(false, "Internal Server Error"));
  }
};

// Monthly Profit and Loss Controller
export const getMonthlyProfitLossController = async (req: Request, res: Response) => {
  try {
    let { month, year } = req.query;
    console.log("Month:", month, "Year:", year);

    // If frontend sends "month" in format "YYYY-MM"
   if (month && typeof month === "string" && !year && month.includes("-")) {
      const [y, m] = month.split("-");
      year = y;
      month = m;
    }

    if (!month || !year) {
      return res
        .status(400)
        .json(customPayloadResponse(false, "Month and Year are required"));
    }

    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59);

    const sales = await Sales.find({
      where: { date: Between(startOfDay(start), endOfDay(end)) },
      relations: ["stock"],
    });

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + (sale.unitPrice || 0) * sale.quantity,
      0
    );
    const totalCost = sales.reduce(
      (sum, sale) => sum + (sale.stock.purchasePrice || 0) * sale.quantity,
      0
    );
    const totalProfit = totalRevenue - totalCost;

    console.log("Monthly Profit/Loss Data:", {
      month,
      year,
      totalRevenue,
      totalCost,
      totalProfit,
      salesCount: sales.length,
    });

    return res.status(200).json(
      customPayloadResponse(true, {
        month,
        year,
        totalRevenue,
        totalCost,
        totalProfit,
        salesCount: sales.length,
      })
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Internal Server Error"));
  }
};

