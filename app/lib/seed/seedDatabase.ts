import { createProduct } from "../../api/products";
import { createCategory } from "../../api/categories";
import { seedProducts, seedCategories } from "./products";

export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    console.log("Seeding categories...");
    const categoryPromises = seedCategories.map((category) =>
      createCategory(category)
    );
    await Promise.all(categoryPromises);
    console.log(`✓ Seeded ${seedCategories.length} categories`);

    console.log("Seeding products...");
    const productPromises = seedProducts.map((product) =>
      createProduct(product)
    );
    await Promise.all(productPromises);
    console.log(`✓ Seeded ${seedProducts.length} products`);

    console.log("Database seeding completed successfully!");
    return {
      success: true,
      message: `Successfully seeded ${seedCategories.length} categories and ${seedProducts.length} products`,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    return {
      success: false,
      message: "Error seeding database. Check console for details.",
    };
  }
};
