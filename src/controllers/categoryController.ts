import { Request, Response } from 'express';
import { prisma } from '../models';
import { ApiError, MainCategory, SubCategory, SubSubCategory } from '../types/types';


export const getAllCategories = async (req: Request, res: Response) => {
  console.log('getAllCategories called');
  try {
    const categories: MainCategory[] = await prisma.mainCategory.findMany({
      include: {
        subCategories: {
          include: {
            subSubCategories: true,
          },
        },
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching all categories:', error);
    const apiError: ApiError = {
      message: 'An error occurred while fetching categories.',
    };
    res.status(500).json(apiError);
  }
};

export const getMainCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category: MainCategory | null = await prisma.mainCategory.findUnique({
      where: { id: Number(id) },
      include: {
        subCategories: {
          include: {
            subSubCategories: true,
          },
        },
      },
    });

    if (!category) {
      const apiError: ApiError = { message: 'Main Category not found.' };
      return res.status(404).json(apiError);
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(`Error fetching Main Category with ID ${id}:`, error);
    const apiError: ApiError = {
      message: 'An error occurred while fetching the main category.',
    };
    res.status(500).json(apiError);
  }
};


export const getSubCategories = async (req: Request, res: Response) => {
  const { mainCategoryId } = req.query;

  try {
    const whereCondition = mainCategoryId
      ? { mainCategoryId: Number(mainCategoryId) }
      : {};

    const subCategories: SubCategory[] = await prisma.subCategory.findMany({
      where: whereCondition,
      include: {
        subSubCategories: true,
        mainCategory: true,
      },
    });

    res.status(200).json(subCategories);
  } catch (error) {
    console.error('Error fetching sub categories:', error);
    const apiError: ApiError = {
      message: 'An error occurred while fetching sub categories.',
    };
    res.status(500).json(apiError);
  }
};


export const getSubSubCategories = async (req: Request, res: Response) => {
  const { subCategoryId } = req.query;

  try {
    const whereCondition = subCategoryId
      ? { subCategoryId: Number(subCategoryId) }
      : {};

    const subSubCategories: SubSubCategory[] = await prisma.subSubCategory.findMany({
      where: whereCondition,
      include: {
        subCategory: {
          include: {
            mainCategory: true, 
          },
        },
      },
    });

    res.status(200).json(subSubCategories);
  } catch (error) {
    console.error('Error fetching sub-sub categories:', error);
    const apiError: ApiError = {
      message: 'An error occurred while fetching sub-sub categories.',
    };
    res.status(500).json(apiError);
  }
};
