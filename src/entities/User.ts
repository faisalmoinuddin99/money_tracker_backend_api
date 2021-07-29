import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { v4 as uuid } from "uuid" 
import bcrypt from "bcrypt"
import { createHmac } from "crypto"

@Entity('user')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    
    @Column({
        nullable: false
    })
    first_name!: string

    @Column()
    last_name!: string

    @Column({
       unique: true,
       nullable: false
    })
    email!: string

    
     @Column()
    encrypted_password!: string

    @Generated("uuid")
    salt! : string

    @Column()
  passwordUsingBcrypt!: string;

    @Column()
  passwordUsingCrypto!: string;

  @BeforeInsert()
  async generatePasswordHash(): Promise<void> {
    console.log('GENERATE');
    this.passwordUsingBcrypt = await bcrypt.hashSync(this.passwordUsingBcrypt, bcrypt.genSaltSync(10));
   
    }
    @BeforeInsert()
    async generatePasswordCrypto(): Promise<void> {
      console.log('GENERATE');
      const secret = "abcdefg"
      this.passwordUsingCrypto = await  createHmac('sha256', secret)
               .update(this.passwordUsingCrypto)
               .digest('hex'); 
    }
    
     @CreateDateColumn()
    create_at!: Date 
    
    @UpdateDateColumn()
    updated_at!: Date

    
}