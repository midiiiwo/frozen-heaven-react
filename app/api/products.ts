import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firbase";

const COLLECTION_NAME = "products";

// Helper to convert Firebase Timestamp to Date
const convertTimestamp = (data: any) => {
  if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
  if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate();
  return data;
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamp(docSnap.data()),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Get products by category
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    if (category === "All") {
      return getAllProducts();
    }

    const q = query(
      collection(db, COLLECTION_NAME),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

// Create product
export const createProduct = async (
  product: Omit<Product, "id">
): Promise<Product | null> => {
  try {
    const productData = {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), productData);
    return {
      id: docRef.id,
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};

// Update product
export const updateProduct = async (
  id: string,
  product: Partial<Product>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...product,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};

// Update product stock
export const updateProductStock = async (
  id: string,
  stock: number
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      stock,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error updating product stock:", error);
    return false;
  }
};

// Search products
export const searchProducts = async (
  searchTerm: string
): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();
    const searchLower = searchTerm.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};
