import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity()
export class UserType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;
}

// Fetch all user types
export const getUserTypes = async () => {
  const userTypes = await UserType.find({
    order: {
      id: "DESC",
    },
  });

  return userTypes;
};

// Add a new user type
export const addUserType = async (type: string) => {
  const userTypeToAdd = await UserType.insert({
    type: type,
  });
  return userTypeToAdd;
};

// Get user type by ID
export const getUserTypeById = async (id: number) => {
  const userType = await UserType.findOne({ where: { id } });
  return userType;
};

// Get user type by type string
export const getUserTypeByType = async (type: string) => {
  const userType = await UserType.findOne({
    where: { type: type },
  });
  return userType;
};

// Delete user type
export const deleteUserType = async (id: number) => {
  const result = await UserType.delete(id);
  if (result && result.affected && result.affected > 0) {
    return "User Type Deleted";
  } else {
    return "User Type Not Found";
  }
};

// Update user type
export const updateUserType = async (id: number, type: string) => {
  const userTypeToUpdate = await UserType.update(id, { type });
  return userTypeToUpdate;
};
