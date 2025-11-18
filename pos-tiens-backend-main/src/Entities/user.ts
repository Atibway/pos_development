// src/Entities/User.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name!: string;

  @Column({ nullable: true })
  middle_name!: string;

  @Column()
  last_name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column("simple-array", { nullable: true })
  roles!: string[];

  @Column({ nullable: true })
  profile_picture!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  phone_number!: string;

  @Column({ nullable: true })
  date_of_birth!: Date;

  @Column({ nullable: true })
  gender!: string;

  @Column({ nullable: true })
  marital_status!: string;

  @Column({ nullable: true })
  nationality!: string;
}

// Fetch all users
export const getUsers = async () => {
  return await User.find({ order: { id: "DESC" } });
};

// Add new user
export const addUser = async (
  email: string,
  last_name: string,
  first_name: string,
  middle_name: string,
  password: any,
  roles: string[]
) => {
  return await User.insert({
    email,
    last_name,
    first_name,
    middle_name,
    password,
    roles,
  });
};

// Delete user by ID
export const deleteUser = async (id: number) => {
  const result = await User.delete(id);
  if (result && result.affected && result.affected > 0) {
    return "User Deleted";
  } else {
    return "User Not Found";
  }
};

// Get user by ID
export const getUserById = async (id: number) => {
  return await User.findOne({ where: { id } });
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  return await User.findOne({
    where: { email },
    select: [
      "id",
      "email",
      "password",
      "first_name",
      "last_name",
      "middle_name",
    ],
  });
};

// Update user basic info
export const updateUser = async (
  id: number,
  email: string,
  last_name: string,
  first_name: string,
  middle_name: string,
  roles: string[]
) => {
  // Remove duplicates by creating a Set, then back to an array
  const uniqueRoles = Array.from(new Set(roles));

  return await User.update(id, {
    email,
    last_name,
    first_name,
    middle_name,
    roles: uniqueRoles,
  });
};

// Update user password
export const updateUserPassword = async (email: string, password: any) => {
  return await User.update({ email }, { password });
};

// Update user profile
export const updateUserProfile = async (
  id: number,
  first_name: string,
  middle_name: string,
  last_name: string,
  email: string,
  address: string,
  phone_number: string,
  date_of_birth: string,
  gender: string,
  marital_status: string,
  nationality: string
) => {
  const user = await User.findOne({ where: { id } });
  if (!user) throw new Error("User account does not exist");


  user.first_name = first_name;
  user.middle_name = middle_name;
  user.last_name = last_name;
  user.address = address;
  user.phone_number = phone_number;
  user.date_of_birth = new Date(date_of_birth);
  user.gender = gender;
  user.marital_status = marital_status;
  user.nationality = nationality;
  user.email = email;

  await user.save();
  return user;
};

// Update profile picture
export const updateUserProfilePicture = async (
  id: number,
  profile_picture: string
) => {
  const user = await User.findOne({ where: { id } });
  if (!user) throw new Error("User account does not exist");

  user.profile_picture = profile_picture;
  await user.save();

  return user;
};

// Create new user
export const createUser = async (
  firstName: string,
  middleName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const user = new User();
  user.first_name = firstName;
  user.middle_name = middleName;
  user.last_name = lastName;
  user.email = email;
  user.password = password;

  await user.save();
  return user;
};

// Set user roles
export const setUserRoles = async (id: number, roles: string[]) => {
  const user = await User.findOne({ where: { id } });
  if (!user) throw new Error("User account does not exist");

  user.roles = roles;
  await user.save();

  return user;
};
