import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firbase";

const COLLECTION_NAME = "categories";

const convertTimestamp = (data: any) => {
  if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
  if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate();
  return data;
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTION_NAME), orderBy("name", "asc"))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamp(docSnap.data()),
      } as Category;
    }
    return null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

export const createCategory = async (
  category: Omit<Category, "id">
): Promise<Category | null> => {
  try {
    const categoryData = {
      ...category,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), categoryData);
    return {
      id: docRef.id,
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
};

export const updateCategory = async (
  id: string,
  category: Partial<Category>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...category,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error updating category:", error);
    return false;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};
