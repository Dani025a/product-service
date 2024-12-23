import { Request, Response } from 'express';
import productService from '../services/productService';

class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const {
        categoryId,
        subCategoryId,
        subSubCategoryId,
        sorting,
        filters,
      }: {
        categoryId?: number;
        subCategoryId?: number;
        subSubCategoryId?: number;
        sorting?: { field: string; order: "asc" | "desc" };
        filters?: {
          filterOptionId: number;
          type: "slider" | "checkbox" | "dropdown";
          values: number[] | { min: number; max: number };
        }[];
      } = req.body;

      if (!categoryId && !subCategoryId && !subSubCategoryId) {
        return res.status(400).json({
          error: "At least one of categoryId, subCategoryId, or subSubCategoryId must be provided.",
        });
      }
      

      if (filters) {
        for (const filter of filters) {
          if (
            !filter.filterOptionId ||
            !filter.type ||
            !filter.values ||
            (filter.type === 'slider' &&
              (typeof (filter.values as { min: number; max: number }).min !== 'number' ||
               typeof (filter.values as { min: number; max: number }).max !== 'number'))
          ) {
            return res.status(400).json({
              error: "Invalid filter structure.",
            });
          }

          if (
            (filter.type === 'checkbox' || filter.type === 'dropdown') &&
            !Array.isArray(filter.values)
          ) {
            return res.status(400).json({
              error: `Filter values for type ${filter.type} must be an array of numbers.`,
            });
          }
        }
      }

      const products = await productService.getProductsByCategoryAndFilters({
        categoryId,
        subCategoryId,
        subSubCategoryId,
        sorting,
        filters,
      });

      return res.status(200).json(products);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ error: "Failed to fetch products." });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid product ID.' });
      }

      const product = await productService.getProductById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      return res.status(200).json(product);
    } catch (error: any) {
      console.error('Error fetching product by ID:', error);
      return res.status(500).json({ error: 'Failed to fetch product.' });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getProducts();
      return res.status(200).json(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Failed to fetch products.' });
    }
  }

  async getProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    const product = await productService.getProductByIdForOrder(id);
    if (!product) return res.status(404).json({ error: 'Not Found' });
    return res.json(product);
  }
}

export default new ProductController();
