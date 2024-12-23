import { Request, Response } from "express";
import filterService from "../services/filterService";

class FilterController {
    async getFilters(req: Request, res: Response) {
        try {
            const { categoryId, level } = req.query;

            if (!categoryId || !level) {
                return res.status(400).json({ message: "categoryId and level are required" });
            }

            const validLevels = ['main', 'sub', 'subsub'];
            if (!validLevels.includes(level as string)) {
                return res.status(400).json({ message: `Invalid level. Valid levels are: ${validLevels.join(", ")}` });
            }

            const filters = await filterService.getFiltersByCategory(
                Number(categoryId),
                level as 'main' | 'sub' | 'subsub'
            );

            console.log(filters)

            return res.status(200).json(filters);
        } catch (error) {
            console.error("Error fetching filters:", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}

export default new FilterController();
