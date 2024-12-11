import { Prisma } from '@prisma/client';
import { prisma } from '../models';

export const createProduct = async (productData: Prisma.ProductCreateInput) => {
  return await prisma.product.create({
    data: productData,
  });
};

interface GetProductsOptions {
    mainCategoryId?: number;
    subCategoryId?: number;
    subSubCategoryId?: number;
    filterValueId?: number;
    rangeField?: string;
    minRange?: number;
    maxRange?: number;
    sortBy?: 'mostSold' | 'reviews' | 'name' | 'discount' | 'price';
    sortOrder?: 'asc' | 'desc';
  }
  
  export const getProductsByCategoryAndFilters = async ({
    mainCategoryId,
    subCategoryId,
    subSubCategoryId,
    filterValueId,
    rangeField,
    minRange,
    maxRange,
    sortBy,
    sortOrder = 'asc'
  }: GetProductsOptions) => {
    try {
      const rangeCondition = rangeField && (minRange !== undefined || maxRange !== undefined)
        ? {
            [rangeField]: {
              ...(minRange !== undefined ? { gte: minRange } : {}),
              ...(maxRange !== undefined ? { lte: maxRange } : {})
            }
          }
        : undefined;
  
      const products = await prisma.product.findMany({
        where: {
          subSubCategory: subSubCategoryId
            ? { id: subSubCategoryId }
            : subCategoryId
            ? { subCategory: { id: subCategoryId } }
            : mainCategoryId
            ? { subCategory: { mainCategory: { id: mainCategoryId } } }
            : undefined,
          filters: filterValueId
            ? {
                some: {
                  filterValueId: filterValueId
                }
              }
            : undefined,
          ...rangeCondition
        },
        include: {
          discount: true,
          reviews: true,
          images: true,
          filters: filterValueId
            ? {
                where: {
                  filterValueId: filterValueId
                }
              }
            : undefined
        },
        orderBy: [
          sortBy === 'price'
            ? { price: sortOrder }
            : sortBy === 'name'
            ? { name: sortOrder }
            : sortBy === 'reviews'
            ? { reviews: { _count: sortOrder } }
            : sortBy === 'discount'
            ? { discount: { percentage: sortOrder } }
            : undefined
        ].filter(Boolean)
      });
  
      if (sortBy === 'mostSold') {
        products.sort((a, b) => (sortOrder === 'asc' ? a.sales - b.sales : b.sales - a.sales));
      }
  
      return products;
    } catch (error) {
      console.error("Detailed error:", error);
      throw new Error("An error occurred while fetching products.");
    }
  };