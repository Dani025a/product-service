
export interface Order {
  id?: string;
  userid: number; 
  status?: string;
  totalPrice: number;
  totalDiscountedPrice: number;
  totalItems: number;
  orderDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  currency: string;
  products: OrderProduct[];
}

export interface OrderProduct {
  product: Product;
}

export enum OrderStatus {
  PENDING = "PENDING",
  AWAITING_PAYMENT = "AWAITING_PAYMENT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
  discountId?: number;
  discount?: Discount;
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
  subSubCategory?: SubSubCategory;
  images?: Image[];
  reviews?: Review[];
  filters?: FilterOption[];
}

export enum Status {
    active = 'active',
    inactive = 'inactive',
  }
  
  export enum FilterType {
    checkbox = 'checkbox',
    dropdown = 'dropdown',
    slider = 'slider',
  }
  
  export interface MainCategory {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    subCategories?: SubCategory[];
    categoryFilterOptionCategories?: CategoryFilterOptionCategory[];
  }
  
  export interface SubCategory {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    mainCategoryId?: number;
    mainCategory?: MainCategory;
    subSubCategories?: SubSubCategory[];
    categoryFilterOptionCategories?: CategoryFilterOptionCategory[];
  }
  
  export interface SubSubCategory {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    subCategoryId?: number;
    subCategory?: SubCategory;
    products?: Product[];
    categoryFilterOptionCategories?: CategoryFilterOptionCategory[];
  }
  
  export interface FilterOption {
    id: number;
    name: string;
    type: FilterType;
    createdAt?: Date;
    updatedAt?: Date;
    filterValues: FilterValue[];
    categoryOptions: CategoryFilterOption[];
  }
  
  export interface FilterValue {
    id: number;
    value: string;
    createdAt?: Date;
    updatedAt?: Date;
    filterOptionId: number;
    filterOption?: FilterOption;
    productFilters: ProductFilter[];
  }
  
  export interface CategoryFilterOption {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    filterOptionId: number;
    filterOption?: FilterOption;
    categoryRelations: CategoryFilterOptionCategory[];
  }
  
  export interface CategoryFilterOptionCategory {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    mainCategoryId?: number;
    subCategoryId?: number;
    subSubCategoryId?: number;
    categoryFilterOptionId: number;
    mainCategory?: MainCategory;
    subCategory?: SubCategory;
    subSubCategory?: SubSubCategory;
    categoryFilterOption?: CategoryFilterOption;
  }
  
  export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
    discountId?: number;
    discount?: Discount;
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
    subSubCategory?: SubSubCategory;
    images?: Image[];
    reviews?: Review[];
    filters?: ProductFilter[];
  }
  
  export interface Discount {
    id: number;
    percentage: number;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
    description: string;
    products?: Product[];
  }
  
  export interface ProductFilter {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    filterValueId: number;
    filterValue?: FilterValue;
    productId: number;
    product?: Product;
  }
  
  export interface Image {
    id: number;
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
    productId: number;
    product?: Product;
  }
  
  export interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
    productId: number;
    product?: Product;
  }
  
  export interface ApiError {
    message: string;
  }
  
  export interface GetFiltersByCategoryOptions {
    mainCategoryId?: number;
    subCategoryId?: number;
    subSubCategoryId?: number;
  }

  
  interface Filter {
    filterOptionId: number;
    type: "slider" | "checkbox" | "dropdown";
    values: number[] | { min: number; max: number };
  }

  interface SortingOptions {
    field: string;
    order: "asc" | "desc";
  }
export interface GetProductsOptions {
  categoryId?: number;
  subCategoryId?: number;
  subSubCategoryId?: number;
  sorting?: SortingOptions;
  filters?: Filter[];
}