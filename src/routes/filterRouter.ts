import { Router } from "express";
import filterController from "../controllers/filterController";

const router = Router();

router.get("/all", filterController.getFilters);

export default router;
