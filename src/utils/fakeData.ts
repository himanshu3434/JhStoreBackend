import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "./asyncHandler.js";
import { faker } from "@faker-js/faker";
export const fakeProduct = async (count: number) => {
  for (let i = 0; i < count; i++) {
    await Product.create({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      stock: faker.number.int(100),
      price: faker.number.int(5000),
      category_id: faker.database.mongodbObjectId(),
      coverPhoto: faker.database.mongodbObjectId(),
      photo1: faker.database.mongodbObjectId(),
      photo2: faker.database.mongodbObjectId(),
      photo3: faker.database.mongodbObjectId(),
    });
  }
};
export const fakeCategory = async (count: number) => {
  for (let i = 0; i < count; i++) {
    await Category.create({
      name: faker.commerce.productName(),
    });
  }
};
