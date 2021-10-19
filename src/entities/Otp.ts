import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  phone!: string;

  @Column()
  otp!: number;

  @Column({ default: true })
  isActive!: Boolean;
}
