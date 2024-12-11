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
    ERROR_CREATING_PRODUCT: 'Error creating product:',
    PRODUCT_CREATED: 'Product created successfully',

  }
};