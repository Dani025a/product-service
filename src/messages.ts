import { INTERNAL } from "sqlite3";

export const MESSAGES = {
  AUTH: {
    TOKEN_MISSING: 'Access token is missing.',
    INVALID_ACCESS_TOKEN: 'Invalid access token.',
    NOT_ADMIN: 'User is not an admin.',
  },
  PRODUCT: {
    PRODUCT_NOT_FOUND: 'Product not found.',
    PRODUCT_NAME_PRICE_REQUIRED: 'Product name and price are required.',
    INTERNAL_ERROR: 'Internal server error',
    ERROR_CREATING_PRODUCT: 'Error creating product',
    PRODUCT_CREATED: 'Product created successfully',
    INVALID_CATEGORY: 'The selected category is invalid. Please choose a valid category.',
    PRODUCT_VIEW_ERROR: 'An error occurred while viewing the product',
    CREATION_ERROR: 'Error creating product',
    FETCH_ERROR: 'An error occurred while fetching products',
    INVALID_FILTER_VALUES: 'Invalid filter values. Ensure filterValues is an array of valid filterOptionId and filterValueId objects.',
    PRODUCT_UPDATED: "Product updated successfully.",
    PRODUCT_DELETED: "Product deleted successfully.",
    NOT_FOUND: "Product not found.",
    ERROR_UPDATING_PRODUCT: "Error updating product.",
    ERROR_DELETING_PRODUCT: "Error deleting product.",
    STOCK_UPDATED_SUCCESS: 'Stock updated successfully.',
    STOCK_RESTORED_SUCCESS: 'Stock restored successfully.',
    INSUFFICIENT_STOCK: 'Insufficient stock for one or more products.',
    PRODUCT_OUT_OF_STOCK: 'Product out of stock.',
    INVALID_DATA: 'Invalid data provided.',
    PRICE_MISMATCH: "Price mismatch detected between calculated and provided totals."
  },
};