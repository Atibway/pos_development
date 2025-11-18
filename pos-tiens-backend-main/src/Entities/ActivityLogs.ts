import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { User } from "./user";


@Entity()
export class ActivityLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "SET NULL", eager: true })
  user: User;

  @Column()
  action: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  timestamp: Date;
}

// activityLog.ts
export const saveActivityLog = async (
  userId: number,
  action: string,
  description?: string
) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error("user not found");

  const log = await ActivityLog.insert({
    user,
    action,
    description,
  });

  return log;
};

export const fetchActivityLog = async () => {
  return await ActivityLog.find({
    order: {
      timestamp: "DESC",
    },
  });
};
