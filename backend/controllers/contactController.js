import nodemailer from "nodemailer";
import getCoordsForAddress from "../utils/location.js";
import { Message } from "../models/messageModel.js";

export const createMessage = async (req, res, next) => {
  try {
    const { firstName, lastName, email, information } = req.body;

    const message = new Message({ firstName, lastName, email, information });

    let newMessage = await message.save();

    if (!newMessage) {
      res.status(400);
      throw new Error(req.t("contact.invalidMessageData"));
    }

    let host = process.env.SMTP_HOST;
    let port = process.env.SMTP_PORT || 465;
    let user = process.env.SMTP_USER;
    let password = process.env.SMTP_PASSWORD;
    let domain = process.env.DOMAIN;

    let to_1 = process.env.TO_1;
    let to_2 = process.env.TO_2;

    let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      // secure: false,
      requireTLS: true,
      auth: {
        user: user,
        pass: password,
      },
    });

    let from = `"BookStore Client 👻"<jsx@${domain}>`;

    let to = `<${to_1}>,<${to_2}>`;

    let subject = `Informacja od ${email}`;

    let text = `Message from ${newMessage.firstName === "" ? "X" : newMessage.firstName} ${newMessage.lastName === "" ? "Y" : newMessage.lastName}: ${newMessage.information}. Email: ${newMessage.email}`;

    const info = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Sent message id: %s", info.messageId);

    res.status(201).json({
      message: req.t("contact.messageSent"),
      info: info.messageId,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

export const getPlace = async (req, res, next) => {
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(
      process.env.ADDRESS,
      req,
      res,
      next
    );

    if (!coordinates) {
      throw new Error(req.t("contact.noPlaceFound"));
    }
    res.json({ location: coordinates });
  } catch (err) {
    next(err);
  }
};
