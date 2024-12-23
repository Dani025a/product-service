
import { Status } from '@prisma/client'; // Ensure this import matches your Prisma setup

export interface Filter {
  filterOptionId: number;
  filterValueId: number;
}


export interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  status: Status;
  seoTitle: string;
  seoDescription: string;
  metaKeywords: string;
  subSubCategoryId?: number;
  discountId?: number;
  images: Array<string | Express.Multer.File>;
  filters?: Filter[];
}


interface SortingOptions {
  field: string;
  order: "asc" | "desc";
}

interface FilterForSorting {
  filterOptionId: number;
  type: "slider" | "checkbox" | "dropdown";
  values: number[] | { min: number; max: number };
}

export interface GetProductsOptions {
  categoryId?: number;
  subCategoryId?: number;
  subSubCategoryId?: number;
  sorting?: SortingOptions;
  filters?: FilterForSorting[];
}

export enum FilterType {
  checkbox = 'checkbox',
  dropdown = 'dropdown',
  slider = 'slider',
}
