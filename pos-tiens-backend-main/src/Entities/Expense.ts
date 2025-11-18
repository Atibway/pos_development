import {startOfDay, endOfDay} from "date-fns";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  In,
  Like,
  CreateDateColumn,
  Between
} from "typeorm";

@Entity()
export class Expense extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column()
  amount!: number;

  @Column()
  expense!: string;

  @Column()
  receivedBy!: string;

  @Column()
  type!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

export const getExpenses = async () => {
  const expenses = await Expense.find({
    order: {
      id: "DESC",
    },
    take: 20,
  });
  return expenses;
};

export const createExpense = async (
  date: string,
  amount: number,
  expense: string,
  receivedBy: string,
  type: string,
) => {
  const expenseToInsert = await Expense.insert({
    date,
    amount,
    expense,
    receivedBy,
    type,
  });
  return expenseToInsert;
};

export const deleteExpense = async (id: number) => {
  const expense = await Expense.delete(id);
  if (expense && expense.affected && expense.affected > 0) {
    return "Expense Deleted";
  } else {
    return "Expense Not Found";
  }
};

export const updateExpense = async (
  id: number,
  date: string,
  amount: number,
  expense: string,
  receivedBy: string,
  type: string,
) => {
  const expenseUpdate = await Expense.update(id, {
    date: date,
    amount: amount,
    expense: expense,
    receivedBy: receivedBy,
    type: type,
  });
  return expenseUpdate;
};

export const getSingleExpense = async (id: number) => {
  const expense = await Expense.findOne({ where: { id: id } });
  return expense;
};


export const getExpensesByDate = async (
  name: string | null = null,
  startDate: string | null = null,
  endDate: string | null = null,
  type: string | null = null,
) => {
  const where: any = {};

  if (startDate !== null && endDate !== null && startDate !== "" && endDate !== "") {
    where.createdAt = Between(startOfDay(new Date(startDate)), endOfDay(new Date(endDate)));
  } else if (startDate !== null && startDate !== "") {
    where.createdAt = Between(startOfDay(new Date(startDate)), endOfDay(new Date()));
  } else if (endDate !== null && endDate !== "") {
    where.createdAt = Between(startOfDay(new Date(0)), endOfDay(new Date(endDate)));
  }

  if (name !== null && name !== "") {
    where.expense = Like(`%${name}%`);
  }

  if (type !== null && type !== "") {
    where.type = type;
  }


  const expenses = await Expense.find({
    where: where,
    order: {
      id: "DESC",
    },
  });
  return expenses;
}

export const searchExpenses = async (
  name: string | null = null,
  startDate: string | null = null,
  endDate: string | null = null,
  type: string | null = null,
) => {
  const where: any = {};

  if (startDate !== null && endDate !== null && startDate !== "" && endDate !== "") {
    where.date = Between(startOfDay(new Date(startDate)), endOfDay(new Date(endDate)));
  } else if (startDate !== null && startDate !== "") {
    where.date = Between(startOfDay(new Date(startDate)), endOfDay(new Date()));
  } else if (endDate !== null && endDate !== "") {
    where.date = Between(startOfDay(new Date(0)), endOfDay(new Date(endDate)));
  }

  if (name !== null && name !== "") {
    where.expense = Like(`%${name}%`);
  }

  if (type !== null && type !== "") {
    where.type = type;
  }


  const expenses = await Expense.find({
    where: where,
    order: {
      id: "DESC",
    },
  });
  return expenses;
}
