import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Sales } from "./Sales";
import { Loan } from "./Loan";
import { Package } from "./packages"; // 🔁 Package relationship

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  location!: string;

  @Column()
  phone!: string;

  // 🧩 Relationship with Package
  @ManyToOne(() => Package, (pkg) => pkg.customers, {
  nullable: true,
  eager: true,
})
@JoinColumn({ name: "packageId" })
package: Package | null;  // explicit null allowed

@Column({ nullable: true })
packageId: number | null;


  @OneToMany(() => Sales, (sales) => sales.customer, {
    onDelete: "CASCADE",
  })
  sales!: Sales[];

  @OneToMany(() => Loan, (loan) => loan.customer, {
    onDelete: "CASCADE",
    eager: true,
  })
  loans!: Loan[];
}


// Create Customer
export const createCustomer = async (
  name: string,
  email: string,
  location: string,
  phone: string,
  packageId?: number
) => {
  const customer = new Customer();
  customer.name = name;
  customer.email = email;
  customer.location = location;
  customer.phone = phone;

  // Attach a package if provided
  if (packageId) {
    const selectedPackage = await Package.findOne({ where: { id: packageId } });
    if (!selectedPackage) {
      throw new Error("Package not found");
    }
    customer.package = selectedPackage;
  }

  return await customer.save();
};

//  Get all customers (include package)
import { Like } from "typeorm";


export const getCustomers = async (search?: string) => {
  const whereCondition = search
    ? [
        { name: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
        { location: Like(`%${search}%`) },
        { phone: Like(`%${search}%`) },
      ]
    : {};

  return await Customer.find({
    where: whereCondition,
    relations: ["package"], // include package in result
    order: { id: "DESC" },
    cache: false,          // disable cache here
  });
};


//  Delete a customer
export const deleteCustomer = async (id: number) => {
  const customer = await Customer.findOne({ where: { id } });
  if (!customer) throw new Error("Customer not found");
  return await customer.remove();
};

//  Update customer (including package)
export const updateCustomer = async (
  id: number,
  name: string,
  email: string,
  location: string,
  phone: string,
  packageId?: number | null
) => {
  const customer = await Customer.findOne({ where: { id }, relations: ["package"] });
  if (!customer) throw new Error("Customer not found");

  customer.name = name;
  customer.email = email;
  customer.location = location;
  customer.phone = phone;

  if (packageId === null) {
    // clear package relation and foreign key
    customer.package = null;
    customer.packageId = null;
  } else if (packageId !== undefined) {
    const selectedPackage = await Package.findOne({ where: { id: packageId } });
    if (!selectedPackage) throw new Error("Package not found");
    customer.package = selectedPackage;
    customer.packageId = packageId;
  }
  // else undefined -> do not modify package relation

  await customer.save();

  // fetch fresh with relation to avoid stale data
  return await Customer.findOne({ where: { id }, relations: ["package"] });
};


//  Get single customer
export const getCustomer = async (id: number) => {
  const customer = await Customer.findOne({
    where: { id },
    relations: ["package"], // include package in the result
  });
  if (!customer) throw new Error("Customer not found");
  return customer;
};
