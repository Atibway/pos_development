import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";

@Entity()
export class Banking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: string;

  @Column()
  amount!: number;

  @Column()
  comment!: string;
}

export const getBankings = async () => {
  const bankings = await Banking.find({
    order: {
      id: "DESC",
    },
  });

  return bankings;
};

export const addBankings = async (
  date: string,
  amount: number,
  comment: string
) => {
  const bankings = await Banking.insert({
    date: date,
    amount: amount,
    comment: comment,
  });
  return bankings;
};

export const getBankingById = async (id: number) => {
  const bank = await Banking.findOne({ where: { id: id } });
  return bank;
};

export const getBankByDate = async (date: string) => {
  const bank = await Banking.findOne({
    where: { date: date },
  });
  return bank;
};

export const deleteBanking = async (id: number) => {
  const bank = await Banking.delete(id);
  if (bank && bank.affected && bank.affected > 0) {
    return "bank Deleted";
  } else {
    return "bank Not Found";
  }
};

export const updateBanking = async (
  id: number,
  date: string,
  amount: number,
  comment: string
) => {
  const bank = await Banking.update(id, {
    date: date,
    amount: amount,
    comment: comment,
  });
  return bank;
};
