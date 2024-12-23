import { Request, Response, NextFunction } from 'express';

export const validateProductQuery = (req: Request, res: Response, next: NextFunction) => {
  const { sortBy, sortOrder, rangeField } = req.query;

  const validSortBy = ['mostSold', 'reviews', 'name', 'discount', 'price'];
  const validSortOrder = ['asc', 'desc'];
  const validRangeFields = ['price', 'weight', 'length', 'width', 'height'];

  if (sortBy && !validSortBy.includes(sortBy as string)) {
    return res.status(400).json({ error: 'Invalid sortBy parameter.' });
  }

  if (sortOrder && !validSortOrder.includes(sortOrder as string)) {
    return res.status(400).json({ error: 'Invalid sortOrder parameter.' });
  }

  if (rangeField && !validRangeFields.includes(rangeField as string)) {
    return res.status(400).json({ error: 'Invalid rangeField parameter.' });
  }

  next();
};
