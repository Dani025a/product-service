import { prisma } from '../models';

interface CategoryData {
  id: number; 
  name: string;
  type: 'mainCategory' | 'subCategory' | 'subSubCategory';
  mainCategoryId?: number; 
  subCategoryId?: number;
}

export const categoryService = {

  async createCategory(data: CategoryData) {
    console.log('Creating category with data:', data);
    const { id, name, type } = data;

    // Determine the parentId based on the category type
    let parentId: number | undefined;

    if (type === 'subCategory') {
      parentId = data.mainCategoryId;
    } else if (type === 'subSubCategory') {
      parentId = data.subCategoryId;
    }

    switch (type) {
      case 'mainCategory':
        await prisma.mainCategory.create({ data: { id, name } });
        break;
      case 'subCategory':
        if (!parentId) throw new Error('Parent ID (mainCategoryId) is required for subCategory');
        // Verify parent exists
        const mainCategory = await prisma.mainCategory.findUnique({ where: { id: parentId } });
        if (!mainCategory) throw new Error(`MainCategory with id ${parentId} does not exist`);
        await prisma.subCategory.create({
          data: {
            id,
            name,
            mainCategoryId: parentId,
          },
        });
        break;
      case 'subSubCategory':
        if (!parentId) throw new Error('Parent ID (subCategoryId) is required for subSubCategory');
        // Verify parent exists
        const subCategory = await prisma.subCategory.findUnique({ where: { id: parentId } });
        if (!subCategory) throw new Error(`SubCategory with id ${parentId} does not exist`);
        await prisma.subSubCategory.create({
          data: {
            id,
            name,
            subCategoryId: parentId,
          },
        });
        break;
      default:
        throw new Error(`Unknown category type: ${type}`);
    }
  },

  async updateCategory(data: CategoryData) {
    console.log('Updating category with data:', data);
    const { id, name, type } = data;

    // Determine the parentId based on the category type
    let parentId: number | undefined;

    if (type === 'subCategory') {
      parentId = data.mainCategoryId;
    } else if (type === 'subSubCategory') {
      parentId = data.subCategoryId;
    }

    switch (type) {
      case 'mainCategory':
        await prisma.mainCategory.update({
          where: { id },
          data: { name },
        });
        break;
      case 'subCategory':
        await prisma.subCategory.update({
          where: { id },
          data: {
            name,
            mainCategoryId: parentId || undefined,
          },
        });
        break;
      case 'subSubCategory':
        await prisma.subSubCategory.update({
          where: { id },
          data: {
            name,
            subCategoryId: parentId || undefined,
          },
        });
        break;
      default:
        throw new Error(`Unknown category type: ${type}`);
    }
  },

  async deleteCategory(data: CategoryData, relatedData: any) {
    console.log('Deleting category with data:', data, 'and related data:', relatedData);
    const { id, type } = data;

    switch (type) {
      case 'mainCategory':
        await prisma.$transaction(async (prisma) => {
          const subCategories = await prisma.subCategory.findMany({
            where: { mainCategoryId: id },
            include: { subSubCategories: true },
          });

          const subCategoryIds = subCategories.map((sc) => sc.id);
          const subSubCategoryIds = subCategories.flatMap((sc) =>
            sc.subSubCategories.map((ssc) => ssc.id)
          );

          await prisma.product.updateMany({
            where: { subSubCategoryId: { in: subSubCategoryIds } },
            data: { subSubCategoryId: null },
          });

          await prisma.subSubCategory.deleteMany({
            where: { subCategoryId: { in: subCategoryIds } },
          });

          await prisma.subCategory.deleteMany({
            where: { mainCategoryId: id },
          });

          await prisma.mainCategory.delete({ where: { id } });
        });
        break;

      case 'subCategory':
        await prisma.$transaction(async (prisma) => {
          const subSubCategories = await prisma.subSubCategory.findMany({
            where: { subCategoryId: id },
          });

          const subSubCategoryIds = subSubCategories.map((ssc) => ssc.id);

          await prisma.product.updateMany({
            where: { subSubCategoryId: { in: subSubCategoryIds } },
            data: { subSubCategoryId: null },
          });

          await prisma.subSubCategory.deleteMany({
            where: { subCategoryId: id },
          });

          await prisma.subCategory.delete({ where: { id } });
        });
        break;

      case 'subSubCategory':
        await prisma.$transaction(async (prisma) => {
          await prisma.product.updateMany({
            where: { subSubCategoryId: id },
            data: { subSubCategoryId: null },
          });

          await prisma.subSubCategory.delete({ where: { id } });
        });
        break;

      default:
        throw new Error(`Unknown category type: ${type}`);
    }
  },
};
