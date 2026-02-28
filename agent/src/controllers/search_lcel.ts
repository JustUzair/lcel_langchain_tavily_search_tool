import { NextFunction, Request, Response } from "express";
import { SearchInputSchema } from "../utils/schema";
import { runSearch } from "../search_tool";

export default {
  handleSearch: async (req: Request, res: Response) => {
    try {
      const input = SearchInputSchema.parse(req.body);
      const result = await runSearch(input);
      res.status(200).json(result);
    } catch (err) {
      const errorMessage = (err as Error)?.message ?? "Unknown error occurred";
      res.status(400).json({
        error: errorMessage,
      });
    }
  },
};
