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
} from "firebase/firestore";
import { db } from "./firbase";

const COLLECTION_NAME = "customers";

// Helper to convert Firebase Timestamp to Date
const convertTimestamp = (data: any) => {
  if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
  if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate();
  return data;
};

// Get all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Customer[];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

// Get customer by ID
export const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamp(docSnap.data()),
      } as Customer;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
};

// Get customer by email
export const getCustomerByEmail = async (
  email: string
): Promise<Customer | null> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...convertTimestamp(doc.data()),
      } as Customer;
    }
    return null;
  } catch (error) {
    console.error("Error fetching customer by email:", error);
    return null;
  }
};

// Create customer
export const createCustomer = async (
  customer: Omit<Customer, "id">
): Promise<Customer | null> => {
  try {
    const customerData = {
      ...customer,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), customerData);
    return {
      id: docRef.id,
      ...customer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
};

// Update customer
export const updateCustomer = async (
  id: string,
  customer: Partial<Customer>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...customer,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error updating customer:", error);
    return false;
  }
};

// Delete customer
export const deleteCustomer = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting customer:", error);
    return false;
  }
};

// Search customers
export const searchCustomers = async (
  searchTerm: string
): Promise<Customer[]> => {
  try {
    const allCustomers = await getAllCustomers();
    const searchLower = searchTerm.toLowerCase();
    return allCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching customers:", error);
    return [];
  }
};
