import express from "express";
import searchLcelController from "../controllers/search_lcel.js";

const router = express.Router();

router.post("/", searchLcelController.handleSearch);
export default router;
