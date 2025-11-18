import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  In
} from "typeorm";
import { User } from "./user";
import { Stock } from "./Stock";

@Entity()
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn() id!: number;
  @Column() name!: string;
  @Column() serialNumber!: string;
  @Column() location!: string;
  @Column() contact!: string;
  @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
  @JoinColumn() user!: User;

  // embedded array of full-stock snapshots
  @Column("simple-json", { nullable: true })
issuedStocks!: Array<{
  stockId: number;
  productCode: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  pv: number;
  bv: number;
  totalPv: number;
  totalBv: number;
  total: number;
  issuedAt: string;
  halfPrice: boolean;
}>;

}


// =========================
//  Shop Functions Section
// =========================

/**
 * Create a new shop and assign to user.
 */
export const createShop = async (
  name: string,
  serialNumber: string,
  contact: string,
  location: string,
  userId: number
) => {
  console.log(
    `Creating shop: ${name}, Serial: ${serialNumber}, Contact: ${contact}, Location: ${location}, User ID: ${userId}`
  );
  
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const newShop = new Shop();
  newShop.name = name;
  newShop.serialNumber = serialNumber;
  newShop.contact = contact;
  newShop.location = location;
  newShop.user = user;

  await newShop.save();
  return newShop;
};

/**
 * Get all shops (ordered by newest first)
 */
export const getShops = async () => {
  return await Shop.find({
    order: {
      id: "DESC",
    },
  });
};

/**
 * Get a shop by ID
 */
export const getShopById = async (id: number) => {
  const shop = await Shop.findOne({
    where: { id },
    relations: ["stocks"],
  });
  if (!shop) throw new Error("Shop not found");
  return shop;
};

/**
 * Update a shop's fields
 */
export const updateShop = async (
  id: number,
  name?: string,
  serialNumber?: string,
  contact?: string,
  location?: string,
  userId?: number
) => {
  const shop = await Shop.findOne({ where: { id } });
  if (!shop) throw new Error("Shop not found");

  if (name !== undefined) shop.name = name;
  if (contact !== undefined) shop.contact = contact;
  if (location !== undefined) shop.location = location;

  if (userId !== undefined) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    shop.user = user;
  }

  shop.serialNumber = serialNumber || shop.serialNumber;

  await shop.save();
  return shop;
};

/**
 * Delete a shop
 */
export const deleteShop = async (id: number) => {
  const shop = await Shop.findOne({ where: { id } });
  if (!shop) throw new Error("Shop not found");
  await shop.remove();
  return { message: "Shop deleted successfully", id };
};

/**
 * Issue (assign) an array of stock IDs to a shop.
 */


export const assignStocksToShop = async (
  shopId: number,
  stockItems: { id: number; quantity: number }[]
) => {
  if (isNaN(shopId)) throw new Error("Invalid shop ID");
  if (!Array.isArray(stockItems) || stockItems.length === 0) {
    throw new Error("Stock items required");
  }

  const shop = await Shop.findOne({ where: { id: shopId } });
  if (!shop) throw new Error("Shop not found");

  // Initialize if empty
  if (!shop.issuedStocks) {
    shop.issuedStocks = [];
  }

  const ids = [...new Set(stockItems.map(item => item.id))];
  const stocksDb = await Stock.findBy({ id: In(ids) });

  if (stocksDb.length !== ids.length) {
    const missing = ids.filter(id => !stocksDb.some(s => s.id === id));
    throw new Error(`Stocks not found: ${missing.join(", ")}`);
  }

  const issuedMap = new Map<number, typeof shop.issuedStocks[0]>(
    shop.issuedStocks.map((s) => [s.stockId, s])
  );

  const errors: string[] = [];
  const now = new Date().toISOString();

  for (const item of stockItems) {
    const stock = stocksDb.find((s) => s.id === item.id)!;

    if (stock.qty < item.quantity) {
      errors.push(`Insufficient stock for ${stock.name} (ID ${stock.id})`);
      continue;
    }

    // Deduct from central inventory
    stock.qty -= item.quantity;
    await stock.save();

    const existing = issuedMap.get(item.id);
    const issuedQty = item.quantity;
    const issuedTotalPv = stock.pv * issuedQty;
    const issuedTotalBv = stock.bv * issuedQty;
    const issuedTotal = stock.price * issuedQty;

    if (existing) {
      existing.qty += issuedQty;
      existing.totalPv += issuedTotalPv;
      existing.totalBv += issuedTotalBv;
      existing.total += issuedTotal;
      existing.issuedAt = now;
      existing.halfPrice = stock.halfPrice; // Update with current halfPrice status
    } else {
      issuedMap.set(item.id, {
        stockId: stock.id,
        productCode: stock.productCode,
        name: stock.name,
        description: stock.description,
        price: stock.price,
        qty: issuedQty,
        pv: stock.pv,
        bv: stock.bv,
        totalPv: issuedTotalPv,
        totalBv: issuedTotalBv,
        total: issuedTotal,
        issuedAt: now,
        halfPrice: stock.halfPrice,
      });
    }
  }

  // Save updated issued stock
  shop.issuedStocks = Array.from(issuedMap.values());
  await shop.save();

  return {
    shopId,
    issued: shop.issuedStocks,
    errors,
  };
};



/**
 * Remove a single stock from a shop.
 */
export const removeStockFromShop = async (
  shopId: number,
  stockId: number
) => {
  const shop = await Shop.findOneBy({ id: shopId });
  if (!shop) throw new Error("Shop not found");

  const initialLength = shop.issuedStocks.length;

  shop.issuedStocks = shop.issuedStocks.filter((s) => s.stockId !== stockId);

  if (shop.issuedStocks.length === initialLength)
    throw new Error(`Stock ${stockId} not found in this shop`);

  await shop.save();

  return { message: `Stock ${stockId} removed from shop ${shopId}` };
};


/**
 * Get all stocks assigned to a shop.
 */
export const getShopsWithIssuedStockByUser = async (userId: number) => {
  const shops = await Shop.find({
    where: { user: { id: userId } }
  });

  if (!shops || shops.length === 0) {
    throw new Error("No shops found for this user");
  }

  // Filter only shops that have issued stock
  const shopsWithStock = shops.filter(shop => shop.issuedStocks && shop.issuedStocks.length > 0);

  if (shopsWithStock.length === 0) {
    throw new Error("No issued stock found for this user's shops");
  }

  return shopsWithStock;
};



/**
 * Clear all stocks from a shop.
 */
export const clearStocksFromShop = async (shopId: number) => {
  const shop = await Shop.findOneBy({ id: shopId });
  if (!shop) throw new Error("Shop not found");

  shop.issuedStocks = [];
  await shop.save();

  return { message: "All stocks removed from shop", shopId };
};