import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Courses } from "./Courses";

@Entity()
export class CourseDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column()
  enrolled!: number;

  @Column()
  rating!: number;

  @Column()
  lectures!: number;

  //course_id
  @OneToOne(() => Courses)
  @JoinColumn()
  course!: Courses;
}
