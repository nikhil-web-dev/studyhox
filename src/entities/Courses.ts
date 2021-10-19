import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  id!: number;

  //course_name
  @Column()
  name!: string;
}
