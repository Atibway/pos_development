import { startOfDay, endOfDay } from "date-fns"
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  Between,
  Like,
  OneToMany,
  MoreThanOrEqual,
  LessThanOrEqual,
} from "typeorm"
import { Stock } from "./Stock"
import { Customer } from "./Customer"
import { Loan } from "./Loan"
import { searchExpenses } from "./Expense"
import { Shop } from "./Shop"

@Entity()
export class Sales extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  date!: Date

  @Column()
  quantity!: number

  @CreateDateColumn()
  createdAt!: Date

  @Column({ default: true })
  paid!: boolean

  @Column({ nullable: true })
  clientType!: string

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  unitPrice!: number

  @ManyToOne(
    () => Stock,
    (stock) => stock.sales,
    {
      onDelete: "CASCADE",
      eager: true,
    },
  )
  stock!: Stock

  @ManyToOne(
    () => Customer,
    (customer) => customer.sales,
    {
      onDelete: "CASCADE",
      eager: true,
      nullable: true,
    },
  )
  customer!: Customer | null

  @ManyToOne(() => Shop, {
    onDelete: "CASCADE",
    eager: true,
  })
  shop!: Shop

  @OneToMany(
    () => Loan,
    (loan) => loan.sales,
    {
      cascade: true,
      eager: true,
    },
  )
  loans!: Loan[]
}

export const createSale = async (
  date: string,
  quantity: number,
  stockId: number,
  customerId: number | null = null,
  paymentDate: string | null = null,
  shopId: number,
  unitPrice: number | null = null,
  clientType = "Member",
): Promise<Sales> => {
  const stock = await Stock.findOne({ where: { id: stockId } })
  if (!stock) throw new Error("Stock not found")

  const shop = await Shop.findOne({ where: { id: shopId } })
  if (!shop) throw new Error("Shop not found")

  let customer: Customer | null = null
  if (customerId) {
    customer = await Customer.findOne({ where: { id: customerId } })
    if (!customer) throw new Error("Customer not found")
  }

  const sales = new Sales()
  sales.date = new Date(date)
  sales.quantity = quantity
  sales.stock = stock
  sales.customer = customer
  sales.paid = !paymentDate
  sales.shop = shop
  sales.clientType = clientType

  // Determine the unit price based on client type
  let finalUnitPrice: number

  switch (clientType) {
    case "Member":
      // Members always pay the stock price
      finalUnitPrice = stock.price
      break
    case "Half-Price (HP) Client":
      // HP clients pay 50% of stock price
      finalUnitPrice = stock.price * 0.5
      break
    case "Non-Member":
    case "Working Client":
      // Non-members and working clients pay custom price
      if (!unitPrice || unitPrice <= 0) {
        throw new Error(`Unit price is required for ${clientType}`)
      }
      finalUnitPrice = unitPrice
      break
    default:
      finalUnitPrice = unitPrice || stock.price
  }

  sales.unitPrice = finalUnitPrice

  await sales.save()

  // Update shop's issued stocks
  const issued = shop.issuedStocks || []
  const issuedItemIndex = issued.findIndex((item) => item.stockId === stockId)

  if (issuedItemIndex === -1) {
    throw new Error("Stock not found in shop's issued stocks")
  }

  issued[issuedItemIndex].qty -= quantity

  if (issued[issuedItemIndex].qty <= 0) {
    issued.splice(issuedItemIndex, 1)
  } else {
    const item = issued[issuedItemIndex]
    item.totalPv = item.qty * item.pv
    item.totalBv = item.qty * item.bv
    item.total = item.qty * item.price
    item.issuedAt = new Date().toISOString()
  }

  shop.issuedStocks = issued
  await shop.save()

  // Create loan if needed
  if (customer && paymentDate) {
    const loan = new Loan()
    loan.amount = finalUnitPrice * quantity
    loan.balance = loan.amount
    loan.customer = customer
    loan.date = new Date(paymentDate)
    loan.sales = sales
    await loan.save()
  }

  return sales
}

export const getSales = async (page = 1) => {
  return await Sales.find({
    order: { id: "DESC" },
    take: 30 * page,
    relations: ["stock", "customer", "loans"],
  })
}

export const getSalesByDate = async (date: string) => {
  const validDate = new Date(date)
  if (isNaN(validDate.getTime())) throw new Error("Invalid Date")

  return await Sales.find({
    where: {
      date: Between(startOfDay(validDate), endOfDay(validDate)),
    },
    order: { id: "DESC" },
    relations: ["stock", "customer", "loans"],
  })
}

export const searchSales = async (
  stockName?: string | null,
  shopName?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  distributorName?: string | null,
  distributorId?: string | null,
) => {
  // Build dynamic where conditions for Sales with relations included
  const whereConditions: any = {};

  if (stockName) {
    // Case-insensitive LIKE for stock.name via query builder OR use LOWER function in raw query
    whereConditions.stock = { name: Like(`%${stockName}%`) };
  }

  if (shopName) {
    whereConditions.shop = { name: Like(`%${shopName}%`) };
  }

  if (distributorName) {
    whereConditions.customer = { name: Like(`%${distributorName}%`) };
  }
  if (distributorId) {
    whereConditions.customer = { name: Like(`%${distributorId}%`) };
  }

  if (startDate && endDate) {
    whereConditions.date = Between(startOfDay(new Date(startDate)), endOfDay(new Date(endDate)));
  } else if (startDate) {
    whereConditions.date = MoreThanOrEqual(startOfDay(new Date(startDate)));
  } else if (endDate) {
    whereConditions.date = LessThanOrEqual(endOfDay(new Date(endDate)));
  }

  return await Sales.find({
    where: whereConditions,
    relations: ["stock", "shop", "customer"],
    order: { id: "DESC" },
    cache: false,
  });
};

export const getSalesAndExpenses = async (startDate: string | null = null, endDate: string | null = null) => {
  const where: any = {}

  if (startDate && endDate) {
    where.createdAt = Between(new Date(startDate), new Date(endDate))
  } else if (startDate) {
    where.createdAt = Between(new Date(startDate), new Date())
  } else if (endDate) {
    where.createdAt = Between(new Date(0), new Date(endDate))
  } else {
    where.createdAt = Between(new Date(0), new Date())
  }

  const sales = await Sales.find({
    where,
    order: { id: "DESC" },
    relations: ["stock", "customer", "loans"],
  })

  const dates = new Set<string>()
  sales.forEach((sale) => dates.add(sale.createdAt.toDateString().slice(0, 10)))

  const expenses = await searchExpenses(null, startDate, endDate)
  expenses.forEach((exp) => dates.add(exp.date.toDateString().slice(0, 10)))

  const result: any[] = []
  dates.forEach((date) => {
    const dailySales = sales.filter((sale) => sale.createdAt.toDateString().slice(0, 10) === date)

    const salesTotal = dailySales.reduce((acc, sale) => {
      // Use actual unit price instead of stock price
      const actualPrice = sale.unitPrice || sale.stock.price
      return acc + actualPrice * sale.quantity
    }, 0)

    const expensesTotal = expenses.reduce((acc, expense) => {
      if (expense.date.toDateString().slice(0, 10) === date) {
        return acc + expense.amount
      }
      return acc
    }, 0)

    const unpaidSales = dailySales.reduce((acc, sale) => {
      if (!sale.paid) {
        const actualPrice = sale.unitPrice || sale.stock.price
        return acc + actualPrice * sale.quantity
      }
      return acc
    }, 0)

    result.push({
      date,
      sales: salesTotal,
      expenses: expensesTotal,
      profit: salesTotal - expensesTotal,
      unpaidSales,
      salesCount: dailySales.length, // Add salesCount here
    })
  })

  return result
}

export const deleteSale = async (saleId: number) => {
  const sale = await Sales.findOne({
    where: { id: saleId },
    relations: ["stock", "loans"],
  })

  // if (!sale) throw new Error("Sale not found")

  if (sale?.stock) {
    sale.stock.qty += sale.quantity
    await sale.stock.save()
  }

  if (sale?.loans && sale.loans.length > 0) {
    for (const loan of sale.loans) {
      await loan.remove()
    }
  }

  await sale?.remove()
  return { message: "Sale deleted successfully" }
}
