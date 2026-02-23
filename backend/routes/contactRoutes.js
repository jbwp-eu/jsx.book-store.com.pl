import express from "express";

import { createMessage, getPlace } from "../controllers/contactController.js";

const router = express.Router();

router.get("/", getPlace);

router.post("/", createMessage);

export default router;
