import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Customer } from "./Customer"; // 🆕 Import Customer

@Entity()
export class Package extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("float")
  amount!: number;

  @Column({ type: "float", default: 10000 })
  registrationFee!: number;

  @Column({ default: false })
  isPaid!: boolean;

  // 🧩 Reverse relation to customers
  @OneToMany(() => Customer, (customer) => customer.package)
  customers!: Customer[];
}


// Get all packages (latest first)
export const getPackages = async () => {
  return await Package.find({
    order: {
      id: "DESC",
    },
  });
};

// Add a new package
export const addPackage = async (
  name: string,
  amount: number
) => {
  const newPackage = await Package.insert({
    name,
    amount,
  });
  return newPackage;
};

// Get package by ID
export const getPackageById = async (id: number) => {
  const pkg = await Package.findOne({
    where: { id },
  });
  return pkg;
};

// Get package by name
export const getPackageByName = async (name: string) => {
  const pkg = await Package.findOne({
    where: { name },
  });
  return pkg;
};

// Delete package by ID
export const deletePackage = async (id: number) => {
  const result = await Package.delete(id);
  if (result.affected) {
    return "Package deleted successfully";
  }
  return "No package found to delete";
};

// Update package
export const updatePackage = async (
  id: number,
  name: string,
  amount: number
) => {
  const updated = await Package.update(id, {
    name,
    amount,
  });
  return updated;
};

// Mark package as paid
export const markPackageAsPaid = async (id: number) => {
  const updated = await Package.update(id, {
    isPaid: true,
  });
  return updated;
};
