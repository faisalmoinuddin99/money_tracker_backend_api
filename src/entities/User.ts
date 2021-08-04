import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { createHmac } from "crypto";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  first_name!: string;

  @Column()
  last_name!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  @Index({ unique: true })
  email!: string;

  @Column({
    type: "uuid",
  })
  salt!: string;

  @Column()
  encry_password!: string;

  @BeforeInsert()
  @BeforeUpdate()
  async generatePasswordCrypto(): Promise<void> {
    console.log("GENERATE");
    this.encry_password = this.securePassword(this.encry_password);
  }

  authenticatePassword = (plainPassword: string) => {
    return this.matchingPassowrd(plainPassword) === this.encry_password;
  };

  matchingPassowrd = (plainpassword: string) => {
    if (!plainpassword) return "";
    try {
      return createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  };

  securePassword = (plainpassword: string) => {
    if (!plainpassword) return "";
    try {
      this.salt = uuid();

      return createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  };

  @CreateDateColumn()
  create_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
