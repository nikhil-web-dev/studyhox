import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Courses } from "./Courses";

@Entity()
export class CourseProf {
  @PrimaryGeneratedColumn()
  id!: number;

  //Prof. name
  @Column()
  name!: string;

  //course_id
  @OneToOne(() => Courses)
  @JoinColumn()
  course!: Courses;
}
