import express, { Request, Response } from "express";
import { getRepository } from "typeorm";

import { body } from "express-validator";
import { OTP } from "../entities/Otp";

import { User } from "../entities/User";
import { sendSNS } from "../utility/sns";
import { BadRequestError } from "../common/errors/bad-request";
import jwt from "jsonwebtoken";
import { registerAuth } from "../middlewares/registerMiddleware";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/add_phone",
  [body("phone").not().isEmpty().withMessage("Phone is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    //get phone number
    const { phone } = req.body;

    //check if phone already exist

    //generate otp
    const otp = Math.floor(Math.random() * 999) + 1000;

    //create message
    let message = `Hi, OTP to verify your account is  ${otp}. Do not share with anyone.`;

    //send otp
    const smsStatus = sendSNS(phone, message); //sendSNS-> boolean function

    if (smsStatus) {
      //save otp
      const otpRepository = getRepository(OTP);
      await otpRepository.save({
        phone,
        otp,
      });

      return res.status(201).json({
        message: "OTP SEND SUCCESSFULLY",
      });
    }

    return res.status(400).json({
      message: "Something went wrong",
    });
  }
);

router.post(
  "verify",
  [
    body("phone").not().isEmpty().withMessage("Phone is required"),
    body("otp").not().isEmpty().withMessage("OTP is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //get phone and otp
    const { phone, otp } = req.body;

    const otpRepository = getRepository(OTP);

    //check of phone exist
    const getExist = await otpRepository.findOne({
      where: {
        phone,
        isActive: true,
      },
    });

    if (!getExist) {
      throw new BadRequestError("Invalid Credentials");
    }

    //match otp and phone
    if (getExist.otp !== otp) {
      throw new BadRequestError("Invalid Credentials");
    }

    //if otp matched, create token and send
    //generate JWT
    const userJwt = jwt.sign(
      {
        id: getExist.id,
        phone: getExist.phone,
      },
      process.env.JWT_KEY as string
    );

    //store jwt in session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(201).json({
      message: "OTP matched successfully",
      token: userJwt,
    });
  }
);

router.post(
  "/register",
  registerAuth,
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email is not valid"),
    body("stream").not().isEmpty().withMessage("Stream is required"),
    body("std").not().isEmpty().withMessage("Standars/Class is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //add middleware

    //get phone from token
    const phone = req.user!.id;

    //get user details
    const { name, stream, email, std } = req.body; //class ==> std

    //save user details
    const userRepository = getRepository(User);

    //check if user exists
    const userExist = await userRepository.findOne({
      where: [email, phone],
    });

    if (userExist) throw new BadRequestError("User already exists");

    //save user
    const user = await userRepository.save({ name, stream, email, std });

    //assigning another token to user with email and phone
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        phone: user.phone,
      },
      process.env.JWT_KEY as string
    );

    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send(user);
  }
);

export { router as authRouter };
