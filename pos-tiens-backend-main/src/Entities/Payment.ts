import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Loan } from "./Loan";

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column()
  amount!: number;

  @Column()
  balance!: number;

  @ManyToOne(() => Loan, (loan) => loan.payments, {
    onDelete: "CASCADE",
  })
  loan!: Loan;
}

/**
 * Create a new payment linked to a loan.
 */
export const createPayment = async (
  loanId: number,
  amount: number,
  date: string
): Promise<Payment> => {
  const loan = await Loan.findOne({ where: { id: loanId } });
  if (!loan) {
    throw new Error("Loan not found");
  }

  const newBalance = loan.balance - amount;
  if (newBalance < 0) {
    throw new Error("Payment amount exceeds remaining loan balance");
  }

  loan.balance = newBalance;
  await loan.save();

  const payment = new Payment();
  payment.amount = amount;
  payment.date = new Date(date);
  payment.balance = newBalance;
  payment.loan = loan;

  await payment.save();
  return payment;
};

/**
 * Get all payments for a loan.
 */
export const getPaymentsByLoan = async (loanId: number): Promise<Payment[]> => {
  return await Payment.find({
    where: { loan: { id: loanId } },
    order: { date: "DESC" },
  });
};

/**
 * Delete a payment by id.
 */
export const deletePayment = async (paymentId: number): Promise<void> => {
  const payment = await Payment.findOne({ where: { id: paymentId }, relations: ["loan"] });
  if (!payment) {
    throw new Error("Payment not found");
  }

  // Restore the loan balance by adding back this payment amount
  payment.loan.balance += payment.amount;
  await payment.loan.save();

  await payment.remove();
};
