import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, Raw } from "typeorm"
import { Category } from "./Category"
import { Sales } from "./Sales"
import { Shop } from "./Shop"

@Entity()
export class Stock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  productCode!: string

  @Column()
  name!: string

  @Column()
  description!: string

  @Column()
  price!: number

  @Column()
  purchasePrice!: number

  @Column()
  qty!: number

  @Column()
  pv!: number

  @Column()
  totalPv!: number

  @Column()
  bv!: number

  @Column()
  totalBv!: number

  @Column()
  total!: number

  @Column()
  date!: string

  @Column({ default: false })
  halfPrice!: boolean

  @ManyToOne(
    () => Category,
    (category) => category.stocks,
    {
      onDelete: "CASCADE",
      eager: true,
    },
  )
  category!: Category

  @OneToMany(
    () => Sales,
    (sales) => sales.stock,
  )
  sales!: Sales[]
}

export const createStock = async (
  productCode: string,
  description: string,
  price: number,
  purchasePrice: number,
  qty: number,
  pv: number,
  bv: number,
  date: string,
  categoryId: number,
  name: string,
  halfPrice: boolean = false,
) => {
  const category = await Category.findOne({ where: { id: categoryId } })

  const totalPv = pv * qty
  const totalBv = bv * qty
  const total = qty * price

  const stock = new Stock()
  stock.productCode = productCode
  stock.description = description
  stock.price = price
  stock.purchasePrice = purchasePrice
  stock.qty = qty
  stock.pv = pv
  stock.totalPv = totalPv
  stock.bv = bv
  stock.totalBv = totalBv
  stock.total = total
  stock.date = date
  stock.name = name
  stock.halfPrice = halfPrice

  if (category) {
    stock.category = category
  }

  await stock.save()
  return stock
}

export const updateStock = async (
  id: number,
  productCode: string,
  description: string,
  price: number,
  qty: number,
  pv: number,
  bv: number,
  date: string,
  categoryId: number,
  name: string,
  purchasePrice?: number,
  halfPrice?: boolean
) => {
  const category = await Category.findOne({ where: { id: categoryId } })
  const stock = await Stock.findOne({ where: { id } })

  if (!stock) throw new Error("Stock not found!")

  stock.productCode = productCode
  stock.description = description
  stock.price = price
  stock.purchasePrice = purchasePrice as number
  stock.qty = qty
  stock.pv = pv
  stock.totalPv = pv * qty
  stock.bv = bv
  stock.totalBv = bv * qty
  stock.total = qty * price
  stock.date = date
  stock.name = name
  
  if (halfPrice !== undefined) {
    stock.halfPrice = halfPrice
  }

  if (category) {
    stock.category = category
  }

  await stock.save()
  return stock
}

export const getStockById = async (stockId: number) => {
  if (!stockId || isNaN(stockId)) {
    throw new Error("Invalid Stock ID");
  }

  const stock = await Stock.findOne({ where: { id: stockId } });

  if (!stock) {
    throw new Error("Stock not found");
  }

  return stock;
};

export const updateStockQuantity = async (stockId: number, newQty: number) => {
  if (!stockId || isNaN(stockId)) {
    throw new Error("Invalid Stock ID");
  }

  if (newQty < 0) {
    throw new Error("Quantity cannot be negative");
  }

  const stock = await Stock.findOne({ where: { id: stockId } });

  if (!stock) {
    throw new Error("Stock not found");
  }

  stock.qty = newQty;
  await stock.save();

  return stock;
};

export const restock = async (id: number, qty: number, price: number, pv: number, bv: number, date: string, halfPrice?: boolean) => {
  const stock = await Stock.findOne({ where: { id } })
  if (!stock) throw new Error("Stock not found!")

  stock.qty += qty
  stock.price = price
  stock.pv = pv
  stock.bv = bv
  stock.totalPv = stock.pv * stock.qty
  stock.totalBv = stock.bv * stock.qty
  stock.total = stock.qty * stock.price
  stock.date = date
  
  if (halfPrice !== undefined) {
    stock.halfPrice = halfPrice
  }

  await stock.save()
  return stock
}



export const getSingleStock = async (id: number) => {
  return await Stock.findOne({ where: { id } })
}



// Enhanced searchStock function with MySQL/MariaDB compatibility
export const searchStock = async (
  searchTerm: string | null = null,
  categoryId: number | null = null,
  minPrice: number | null = null,
  maxPrice: number | null = null,
  halfPrice: boolean | null = null,
) => {
  console.log('searchStock called with parameters:', {
    searchTerm,
    categoryId,
    minPrice,
    maxPrice,
    halfPrice
  });

  const queryBuilder = Stock.createQueryBuilder("stock")
    .leftJoinAndSelect("stock.category", "category")
    .leftJoinAndSelect("stock.sales", "sales")

  let hasConditions = false;

  if (searchTerm && searchTerm.trim()) {
    // Use LIKE instead of ILIKE for MySQL/MariaDB
    // Convert to lowercase for case-insensitive search
    queryBuilder.andWhere(
      "(LOWER(stock.productCode) LIKE LOWER(:search) OR LOWER(stock.name) LIKE LOWER(:search) OR LOWER(stock.description) LIKE LOWER(:search))",
      { search: `%${searchTerm.trim()}%` },
    )
    hasConditions = true;
    console.log('Added search term condition:', searchTerm);
  }

  if (categoryId && !isNaN(categoryId)) {
    queryBuilder.andWhere("category.id = :categoryId", { categoryId })
    hasConditions = true;
    console.log('Added category condition:', categoryId);
  }

  if (minPrice !== null && !isNaN(minPrice)) {
    queryBuilder.andWhere("stock.price >= :minPrice", { minPrice })
    hasConditions = true;
    console.log('Added minPrice condition:', minPrice);
  }

  if (maxPrice !== null && !isNaN(maxPrice)) {
    queryBuilder.andWhere("stock.price <= :maxPrice", { maxPrice })
    hasConditions = true;
    console.log('Added maxPrice condition:', maxPrice);
  }

  if (halfPrice !== null) {
    queryBuilder.andWhere("stock.halfPrice = :halfPrice", { halfPrice })
    hasConditions = true;
    console.log('Added halfPrice condition:', halfPrice);
  }

  queryBuilder.orderBy("stock.productCode", "ASC")

  // Log the final query for debugging
  const sql = queryBuilder.getSql();
  console.log('Generated SQL:', sql);
  console.log('Query parameters:', queryBuilder.getParameters());

  const results = await queryBuilder.getMany();
  console.log(`Query returned ${results.length} results`);

  return results;
}



export const getTopStocks = async () => {
  return await Stock.find({
    order: { productCode: "ASC" },
    relations: ["sales"],
  })
}


// Updated Stock Entity Functions with Shop Integration

export const deleteStock = async (id: number) => {
  const stock = await Stock.findOne({ where: { id } });
  if (!stock) {
    throw new Error("Stock not found");
  }

  // Find all shops that have this stock issued and remove it
  const shopsWithStock = await Shop.find({
    where: {
      issuedStocks: Raw(alias => `JSON_EXTRACT(${alias}, '$[*].stockId') LIKE '%${id}%'`)
    }
  });

  // Remove the stock from all shops that have it
  for (const shop of shopsWithStock) {
    if (shop.issuedStocks && shop.issuedStocks.length > 0) {
      const originalLength = shop.issuedStocks.length;
      shop.issuedStocks = shop.issuedStocks.filter(issuedStock => issuedStock.stockId !== id);
      
      if (shop.issuedStocks.length !== originalLength) {
        await shop.save();
        console.log(`Removed stock ID ${id} from shop "${shop.name}" (ID: ${shop.id})`);
      }
    }
  }

  // Now delete the stock from the main inventory
  await Stock.delete(id);
  
  return {
    message: "Stock deleted successfully",
    removedFromShops: shopsWithStock.length
  };
}

// Updated function to get stocks without mixing HP and regular
export const getStocks = async () => {
  return await Stock.find({
    where: { halfPrice: false }, // Only get regular stock
    order: { productCode: "ASC" },
  });
}

// Make sure getHalfPriceStocks only gets HP stock
export const getHalfPriceStocks = async () => {
  return await Stock.find({
    where: { halfPrice: true }, // Only get half-price stock
    order: { productCode: "ASC" },
    relations: ["sales"],
  });
}

// Updated getAllStocks to be explicit about regular stock only
export const getAllStocks = async () => {
  return await Stock.find({
    order: { productCode: "ASC" },
    where: { halfPrice: false }, // Explicitly only regular stock
    relations: ["sales"],
  });
}

// Add a new function to get all stocks (both types) when needed
export const getAllStocksIncludingHP = async () => {
  return await Stock.find({
    order: { productCode: "ASC" },
    relations: ["sales"],
  });
}
