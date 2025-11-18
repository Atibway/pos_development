// Loan.ts
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Customer } from "./Customer";
import { Sales } from "./Sales";
import { Payment } from "./Payment";

@Entity()
export class Loan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  balance!: number;

  @Column()
  date!: Date;

  @Column()
  amount!: number;

  @ManyToOne(() => Sales, (sales) => sales.loans, {
    onDelete: "CASCADE",
  })
  sales!: Sales;

  @ManyToOne(() => Customer, (customer) => customer.loans, {
    onDelete: "CASCADE",
  })
  customer!: Customer;

  @OneToMany(() => Payment, (payment) => payment.loan, {
    onDelete: "CASCADE",
    eager: true,
  })
  payments!: Payment[];
}

// Loan Functions
export const createLoan = async (
  date: string,
  amount: number,
  customerId: number,
  salesId: number
): Promise<Loan> => {
  const customer = await Customer.findOne({ where: { id: customerId } });
  if (!customer) throw new Error("Customer not found");

  const sale = await Sales.findOne({ where: { id: salesId } });
  if (!sale) throw new Error("Sale not found");

  const loan = new Loan();
  loan.date = new Date(date);
  loan.amount = amount;
  loan.balance = amount;
  loan.customer = customer;
  loan.sales = sale;
  await loan.save();

  return loan;
};

export const payLoan = async (
  id: number,
  amount: number,
  date: string
): Promise<void> => {
  const loan = await Loan.findOne({ where: { id } });
  if (!loan) throw new Error("Loan not found");

  const newBalance = loan.balance - amount;
  if (newBalance < 0) throw new Error("Payment amount exceeds balance");

  loan.balance = newBalance;
  await loan.save();

  const payment = new Payment();
  payment.amount = amount;
  payment.date = new Date(date);
  payment.loan = loan;
  payment.balance = newBalance;
  await payment.save();
};

export const getLoans = async (): Promise<Loan[]> => {
  return await Loan.find({
    order: { id: "DESC" },
    relations: ["customer", "sales", "sales.shop"],
  });
};
