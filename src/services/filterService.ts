import { Prisma } from '@prisma/client';
import { prisma } from '../models';
import { FilterOption, GetFiltersByCategoryOptions } from '../types/types';

class FilterService {
  static async getFiltersByCategory(categoryId: number, level: 'main' | 'sub' | 'subsub') {
    let filterQuery: any = {};

    if (level === 'main') {
        const subCategories = await prisma.subCategory.findMany({
            where: { mainCategoryId: categoryId },
            select: { id: true },
        });

        const subCategoryIds = subCategories.map((sub) => sub.id);

        const subSubCategories = await prisma.subSubCategory.findMany({
            where: { subCategoryId: { in: subCategoryIds } },
            select: { id: true },
        });

        const subSubCategoryIds = subSubCategories.map((subSub) => subSub.id);

        filterQuery = {
            subSubCategoryId: { in: subSubCategoryIds },
        };
    } else if (level === 'sub') {
        const subSubCategories = await prisma.subSubCategory.findMany({
            where: { subCategoryId: categoryId },
            select: { id: true },
        });

        const subSubCategoryIds = subSubCategories.map((subSub) => subSub.id);

        filterQuery = {
            subSubCategoryId: { in: subSubCategoryIds },
        };
    } else if (level === 'subsub') {
        filterQuery = {
            subSubCategoryId: categoryId,
        };
    } else {
        throw new Error("Invalid category level");
    }

    return await prisma.categoryFilterOptionCategory.findMany({
        where: filterQuery,
        include: {
            categoryFilterOption: {
                include: {
                    filterOption: {
                        include: {
                            filterValues: true,
                        },
                    },
                },
            },
        },
    });
}

    static async createFilter(data: any) {

        const existingFilter = await prisma.filterOption.findUnique({ where: { id: data.id } });
        if (existingFilter) {
          throw new Error(`Filter with ID ${data.id} already exists.`);
        }
      
        const validatedFilterValues =
          data.type === 'slider'
            ? []
            : data.filterValues
                .map((filterValue: any) => filterValue.value?.trim())
                .filter((value: string | undefined) => value && value.length > 0);
      
        const filterOption = await prisma.filterOption.create({
          data: {
            id: data.id,
            name: data.name,
            type: data.type,
            filterValues: validatedFilterValues.length > 0
              ? {
                  create: validatedFilterValues.map((value) => ({ value })),
                }
              : undefined,
          },
          include: {
            filterValues: true,
          },
        });

      
        const categoryFilterOption = await prisma.categoryFilterOption.create({
          data: {
            id: data.categoryOptions[0].id,
            filterOptionId: data.id,
          },
        });

        

        const categoryFilterOptionCategory = await prisma.categoryFilterOptionCategory.create({
            data: {
              subSubCategoryId: data.categoryOptions[0].categoryRelations[0].subSubCategoryId,
              categoryFilterOptionId: categoryFilterOption.id,
            },
          });
      
      
        const result = await prisma.filterOption.findUnique({
          where: { id: filterOption.id },
          include: {
            filterValues: true,
            categoryOptions: {
              include: {
                categoryRelations: {
                  include: {
                    mainCategory: true,
                    subCategory: true,
                    subSubCategory: true,
                  },
                },
              },
            },
          },
        });
      
        return result;
      }
      

      static async updateFilter(data: any) {
        const { id, name, type, filterValues } = data;
      
        const filterOption = await prisma.filterOption.findUnique({ where: { id } });
        if (!filterOption) {
          console.warn(`Filter option with ID ${id} not found`);
          return;
        }
      
        const updatedFilterOption = await prisma.filterOption.update({
          where: { id },
          data: {
            name: name || filterOption.name,
            type: type || filterOption.type,
          },
        });
      
        if (filterValues) {
          await prisma.filterValue.deleteMany({ where: { filterOptionId: id } });
          await prisma.filterValue.createMany({
            data: filterValues.map((value: any) => ({
              value: value.value,
              id: value.id,
              filterOptionId: id,
            })),
          });
        }
      
        return updatedFilterOption;
      }


      static async deleteFilter(data: any) {
        const { id } = data;
      
        const filterOption = await prisma.filterOption.findUnique({
          where: { id },
          include: { filterValues: true },
        });
      
        if (!filterOption) {
          throw new Error('Filter option not found');
        }
      
        const filterValueIds = filterOption.filterValues.map((fv) => fv.id);
      
        if (filterValueIds.length > 0) {
          await prisma.productFilter.deleteMany({ where: { filterValueId: { in: filterValueIds } } });
          await prisma.filterValue.deleteMany({ where: { id: { in: filterValueIds } } });
        }
      
        await prisma.categoryFilterOptionCategory.deleteMany({
          where: { categoryFilterOption: { filterOptionId: id } },
        });
      
        await prisma.categoryFilterOption.deleteMany({ where: { filterOptionId: id } });
      
        const deletedFilterOption = await prisma.filterOption.delete({ where: { id } });
      
        const result = {
          deletedFilterOption,
          deletedFilterValues: filterOption.filterValues,
        };
      
      
        return result;
      }
  static async createFilterValue(data: any) {
    const { id, value, filterOptionId } = data;
  
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      throw new Error('Filter value cannot be empty');
    }
  
    const filterOption = await prisma.filterOption.findUnique({
      where: { id: filterOptionId },
    });
  
    if (!filterOption) {
      throw new Error('Filter option not found');
    }
  
    const newFilterValue = await prisma.filterValue.create({
      data: {
        id,
        value: trimmedValue,
        filterOptionId,
      },
    });
  
    const result = await prisma.filterValue.findUnique({
      where: { id: newFilterValue.id },
      include: { filterOption: true },
    });
  
  
    return result;
  }

  static async updateFilterValue(data: any) {
    const { id, value } = data;

    const result = await prisma.filterValue.update({
      where: { id },
      data: { value },
    });

    return result;
  }

  static async deleteFilterValue(data: any) {
    const { id } = data;
  
    const filterValue = await prisma.filterValue.findUnique({
      where: { id },
    });
  
    if (!filterValue) {
      throw new Error('Filter value not found');
    }
  
    await prisma.productFilter.deleteMany({ where: { filterValueId: id } });
    const deletedFilterValue = await prisma.filterValue.delete({ where: { id } });
  
    const result = {
      deletedFilterValue,
    };
  
  
    return result;
  }

  static async createProductFilter(data: any) {
    const { id, productId, filterValueId } = data;
  
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
  
    if (!product) {
      throw new Error('Product not found');
    }
  
    const filterValue = await prisma.filterValue.findUnique({
      where: { id: filterValueId },
    });
  
    if (!filterValue) {
      throw new Error('Filter value not found');
    }
  
    const productFilter = await prisma.productFilter.create({
      data: {
        id,
        productId,
        filterValueId,
      },
    });
  
    const result = await prisma.productFilter.findUnique({
      where: { id: productFilter.id },
      include: {
        product: true,
        filterValue: { include: { filterOption: true } },
      },
    });
  
  
    return result;
  }
  
}


export default FilterService;
