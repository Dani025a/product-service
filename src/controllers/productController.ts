import { MESSAGES } from '../messages'
import { createProduct, getProductsByCategoryAndFilters } from '../services/productService';

export const createProductController = async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.name || !productData.price) {
      return res.status(400).json({ message: MESSAGES.PRODUCT.PRODUCT_NAME_PRICE_REQUIRED });
    }

    const product = await createProduct(productData);

    res.status(201).json({
      success: true,
      message: MESSAGES.PRODUCT.PRODUCT_CREATED,
      product,
    });
    
  } catch (error) {
    console.error(MESSAGES.PRODUCT.ERROR_CREATING_PRODUCT, error);
    res.status(500).json({ success: false, message: MESSAGES.PRODUCT.INTERNAL_ERROR });
  }
};



export const getProducts = async (req: Request, res: Response) => {
  const { mainCategoryId, subCategoryId, subSubCategoryId, filterValueId, rangeField, minRange, maxRange, sortBy, sortOrder } = req.query;

  try {
    const products = await getProductsByCategoryAndFilters({
      mainCategoryId: mainCategoryId ? Number(mainCategoryId) : undefined,
      subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
      subSubCategoryId: subSubCategoryId ? Number(subSubCategoryId) : undefined,
      filterValueId: filterValueId ? Number(filterValueId) : undefined,
      rangeField: rangeField ? String(rangeField) : undefined,
      minRange: minRange ? Number(minRange) : undefined,
      maxRange: maxRange ? Number(maxRange) : undefined,
      sortBy: sortBy as 'mostSold' | 'reviews' | 'name' | 'discount' | 'price',
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};