import express, { Request, Response } from "express";
import { getRepository } from "typeorm"; // import {
//   signup,
//   signin,
//   signout,
//   getCurrentUser,
// } from "../controllers/AuthController";
import { body } from "express-validator";
import { OTP } from "../entities/Otp";

import { Courses } from "../entities/Courses";
import { CourseDetail } from "../entities/CourseDetail";
import { sendSNS } from "../utility/sns";
import { BadRequestError } from "../common/errors/bad-request";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middlewares/require-auth";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post("/courses", requireAuth, async (req: Request, res: Response) => {
  const courseRepository = getRepository(Courses);
  const courses = await courseRepository.find();

  return res.status(200).send(courses);
});

router.post("/course/:id", requireAuth, async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const courseRepository = getRepository(CourseDetail);

  const course = await courseRepository.findOne({
    where: {
      course: courseId,
    },
  });
  return res.status(200).send(course);
});
