// src/services/productService.ts

import { prisma } from '../models';
import { publishStockUpdated } from '../rabbitmq/productPublisher';
import { GetProductsOptions } from '../interfaces/interfaces';
import { MESSAGES } from '../messages';
import Publisher from '../rabbitmq/orderPublisher';
import { Order } from '../types/types';



class ProductService {
  public async createProduct(productData: any) {
    try {
      const {
        id,
        name,
        price,
        description,
        discount,
        reviews,
        images,
        filters,
        stock,
        brand,
        weight,
        length,
        width,
        height,
        status,
        seoTitle,
        seoDescription,
        metaKeywords,
        createdAt,
        updatedAt,
        subSubCategoryId
      } = productData;

      const createdProduct = await prisma.product.create({
        data: {
          id,
          name,
          price,
          description,
          stock,
          brand,
          weight,
          length,
          width,
          height,
          status,
          seoTitle,
          seoDescription,
          metaKeywords,
          createdAt,
          updatedAt,
          discount: discount?.id ? { connect: { id: discount.id } } : undefined,
          subSubCategoryId,
          reviews: reviews?.length
            ? {
                connect: reviews.map((review: any) => ({ id: review.id })),
              }
            : undefined,
          images: images?.length
            ? {
                create: images.map((image: any) => ({
                  id: image.id,
                  url: image.url,
                  createdAt: image.createdAt,
                  updatedAt: image.updatedAt,
                })),
              }
            : undefined,
        },
      });

      if (filters?.length) {
        await prisma.productFilter.createMany({
          data: filters.map((filter: any) => ({
            id: filter.id,
            createdAt: filter.createdAt,
            updatedAt: filter.updatedAt,
            productId: createdProduct.id,
            filterValueId: filter.filterValue.id,
          })),
          skipDuplicates: true, 
        });
      }

      return createdProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product.");
    }
  }

  public async getProductsByCategoryAndFilters(options: GetProductsOptions) {
    const { categoryId, subCategoryId, subSubCategoryId, sorting, filters } = options;

    const whereClause: any = {};

    if (subSubCategoryId) {
      whereClause.subSubCategoryId = subSubCategoryId;
    } else if (subCategoryId) {
      whereClause.subSubCategory = { subCategoryId };
    } else if (categoryId) {
      whereClause.subSubCategory = { subCategory: { mainCategoryId: categoryId } };
    }

    const sliderFilters = filters?.filter((f) => f.type === 'slider') || [];
    const otherFilters = filters?.filter((f) => f.type !== 'slider') || [];

    if (otherFilters.length > 0) {
      whereClause.AND = otherFilters.map((filter) => {
        switch (filter.type) {
          case 'checkbox':
          case 'dropdown':
            return {
              filters: {
                some: {
                  filterValue: {
                    filterOptionId: filter.filterOptionId,
                    id: { in: filter.values as number[] },
                  },
                },
              },
            };
          default:
            return {};
        }
      });
    }

    let orderByClause: any = {};
    if (sorting) {
      if (sorting.field === 'reviews') {
        orderByClause = {
          reviews: { _count: sorting.order },
        };
      } else if (sorting.field === 'discount') {
        orderByClause = {
          discount: { percentage: sorting.order },
        };
      } else if (sorting.field === 'mostSold') {
        orderByClause = {
          sales: sorting.order,
        };
      } else {
        orderByClause = {
          [sorting.field]: sorting.order,
        };
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: sorting ? [orderByClause] : undefined,
      include: {
        images: true,
        discount: true,
        reviews: true,
        subSubCategory: {
          include: {
            subCategory: {
              include: {
                mainCategory: true,
              },
            },
          },
        },
        filters: {
          include: {
            filterValue: {
              include: {
                filterOption: true,
              },
            },
          },
        },
      },
    });

    const filteredProducts = products.filter((product) => {
      return sliderFilters.every((slider) => {
        return product.filters.some((filter) => {
          const filterValue = parseFloat(filter.filterValue.value);
          return (
            !isNaN(filterValue) &&
            filterValue >= slider.values.min &&
            filterValue <= slider.values.max
          );
        });
      });
    });

    console.log(filteredProducts);
    return filteredProducts;
  }

  public async getProducts() {
    try {
      const products = await prisma.product.findMany({
        include: {
          images: true,
          discount: true,
          reviews: true,
          subSubCategory: {
            include: {
              subCategory: {
                include: {
                  mainCategory: true,
                },
              },
            },
          },
          filters: {
            include: {
              filterValue: {
                include: {
                  filterOption: true,
                },
              },
            },
          },
        },
      });

      return products;
    } catch (error) {
      console.error('Error in getProductsService:', error);
      throw error; 
    }
  }

  public async getProductById(id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: id },
        include: {
          images: true,
          discount: true,
          reviews: true,
          subSubCategory: {
            include: {
              subCategory: {
                include: {
                  mainCategory: true,
                },
              },
            },
          },
          filters: {
            include: {
              filterValue: {
                include: {
                  filterOption: true,
                },
              },
            },
          },
        },
      });

      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }

      const transformedFilters = product.filters.reduce((acc: any[], filter) => {
        const { filterValue } = filter;
        if (!filterValue) return acc;

        const existingFilterOption = acc.find(
          (item) => item.id === filterValue.filterOption.id
        );

        if (existingFilterOption) {

          existingFilterOption.filterValues.push({
            id: filterValue.id,
            value: filterValue.value,
          });
        } else {
          acc.push({
            id: filterValue.filterOption.id,
            name: filterValue.filterOption.name,
            type: filterValue.filterOption.type,
            filterValues: [
              {
                id: filterValue.id,
                value: filterValue.value,
              },
            ],
          });
        }
        return acc;
      }, []);


      return {
        ...product,
        filters: transformedFilters,
      };
    } catch (error) {
      console.error('Error in getProductByIdService:', error);
      throw error;
    }
  }

  public async updateProduct(productData: any) {
    const {
      id,
      name,
      description,
      price,
      stock,
      brand,
      weight,
      length,
      width,
      height,
      status,
      seoTitle,
      seoDescription,
      metaKeywords,
      subSubCategoryId,
      discountId,
      images,
      filters,
    } = productData;

    try {
      await prisma.$transaction(async (prismaTx) => {
        await prismaTx.product.upsert({
          where: { id },
          update: {
            name,
            description,
            price,
            stock,
            brand,
            weight,
            length,
            width,
            height,
            status,
            seoTitle,
            seoDescription,
            metaKeywords,
            subSubCategoryId,
            discountId,
          },
          create: {
            id,
            name,
            description,
            price,
            stock,
            brand,
            weight,
            length,
            width,
            height,
            status,
            seoTitle,
            seoDescription,
            metaKeywords,
            subSubCategoryId,
            discountId,
          },
        });

        if (images) {
          const imageIds = images.map((image: any) => image.id).filter((id: any) => id);
          await prismaTx.image.deleteMany({
            where: {
              productId: id,
              NOT: { id: { in: imageIds } },
            },
          });

          for (const image of images) {
            if (image.id) {
              await prismaTx.image.update({
                where: { id: image.id },
                data: { url: image.url },
              });
            } else {
              await prismaTx.image.create({
                data: { productId: id, url: image.url },
              });
            }
          }
        }

        if (filters) {
          await prismaTx.productFilter.deleteMany({ where: { productId: id } });
          for (const filter of filters) {
            if (filter.id) {
              await prismaTx.productFilter.update({
                where: { id: filter.id },
                data: { filterValueId: filter.filterValue.id },
              });
            } else {
              await prismaTx.productFilter.create({
                data: { productId: id, filterValueId: filter.filterValue.id },
              });
            }
          }
        }
      });

      console.log('Product successfully updated in secondary database');
    } catch (error) {
      console.error('Error updating product in secondary database:', error);
      throw new Error('Error updating product in secondary database');
    }
  }

  public async validateProductStockAndPrice(data: {
    orderId: string;
    products: { product: { id: string; quantity: number } }[];
    totalPrice: number;
    totalDiscountedPrice: number;
    replyTo: string;
    correlationId: string;
  }): Promise<{ success: boolean; message: string } | null> {
    const {
      orderId,
      products,
      totalPrice,
      totalDiscountedPrice,
      replyTo,
      correlationId,
    } = data;
  
    let calculatedTotalPrice = 0;
    let calculatedTotalDiscountedPrice = 0;
  
    console.log('Validating Product Stock and Price...');
    console.log('Order Data:', data);
  
    for (const item of products) {
      const product = item.product;
      const dbProduct = await prisma.product.findUnique({
        where: { id: product.id },
        include: {
          discount: true,
        },
      });
  
      if (!dbProduct || dbProduct.stock < product.quantity) {
        await Publisher.productReservationFailed(
          replyTo,
          correlationId,
          orderId,
          `Product ID ${product.id} is out of stock.`
        );
        return { success: false, message: `Product ID ${product.id} is out of stock.` };
      }
  
      const productPrice = dbProduct.price.toNumber();
      calculatedTotalPrice += productPrice * product.quantity;
  
      if (dbProduct.discount) {
        calculatedTotalDiscountedPrice +=
          productPrice * (1 - dbProduct.discount.percentage / 100) * product.quantity;
      } else {
        calculatedTotalDiscountedPrice += productPrice * product.quantity;
      }
    }
  
    if (
      calculatedTotalPrice !== totalDiscountedPrice ||
      calculatedTotalDiscountedPrice !== totalPrice
    ) {
      await Publisher.productReservationFailed(
        replyTo,
        correlationId,
        orderId,
        'Price mismatch.'
      );
      return { success: false, message: 'Price mismatch.' };
    }
  
    for (const item of products) {
      const product = item.product;
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: product.quantity } },
      });
    }

    console.log(replyTo, correlationId)
  
    await Publisher.productStockUpdated(replyTo, correlationId, orderId);
  
    console.log('Product validation successful. Stock updated.');
    return { success: true, message: 'Product validation successful. Stock updated.' };
  }
  
  
  public async deleteProduct(id: number) {
    try {
      await prisma.productFilter.deleteMany({
        where: { productId: id },
      });

      await prisma.image.deleteMany({
        where: { productId: id },
      });

      await prisma.product.delete({
        where: { id },
      });

      console.log(`Product with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error(MESSAGES.PRODUCT.ERROR_DELETING_PRODUCT);
    }
  }

  public async getProductByIdForOrder(id: number) {
    return prisma.product.findUnique({ where: { id }, include: { discount: true }});
  }

  public async handleCancelReservation(order: Order) {
    const { id: orderId, products } = order;

    for (const product of products) {
      await prisma.product.update({
        where: { id: product.product.id },
        data: { stock: { increment: product.product.quantity } },
      });
    }

    console.log(`Stock incremented for cancelled orderId: ${orderId}`);
  }
}

export default new ProductService();
