import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Stock } from "./Stock";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;

  @OneToMany(() => Stock, (stock) => stock.category)
  stocks!: Stock[];

}

export const getCategories = async () => {
  const categories = await Category.find({
    order: {
      id: "DESC",
    },
  });

  return categories;
};

export const addCategories = async (type: string) => {
  const categoriesToAdd = await Category.insert({
    type: type,
  });
  return categoriesToAdd;
};

export const getCategoriesById = async (id: number) => {
  const categoriesToFindById = await Category.findOne({ where: { id: id } });
  return categoriesToFindById;
};

export const getCategoriesByType = async (type: string) => {
  const categoriesToFindByType = await Category.findOne({
    where: { type: type },
  });
  return categoriesToFindByType;
};

export const deleteCategories = async (id: number) => {
  const categoriesToDelete = await Category.delete(id);
  if (categoriesToDelete && categoriesToDelete.affected && categoriesToDelete.affected > 0) {
    return "Staff Type Deleted";
  } else {
    return "No Category Deleted";
  }
};

export const updateCategories = async (id: number, type: string) => {
  const categoriesToUpdate = await Category.update(id, { type: type });
  return categoriesToUpdate;
};
