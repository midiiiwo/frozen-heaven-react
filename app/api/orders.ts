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

const COLLECTION_NAME = "orders";

// Helper to convert Firebase Timestamp to Date
const convertTimestamp = (data: any) => {
  if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
  if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate();
  return data;
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamp(docSnap.data()),
      } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

// Get orders by status
export const getOrdersByStatus = async (
  status: Order["status"]
): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return [];
  }
};

// Get orders by customer email
export const getOrdersByCustomer = async (
  customerEmail: string
): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("customerEmail", "==", customerEmail),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }
};

// Create order
export const createOrder = async (
  order: Omit<Order, "id">
): Promise<Order | null> => {
  try {
    const orderData = {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), orderData);
    return {
      id: docRef.id,
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

// Update order
export const updateOrder = async (
  id: string,
  order: Partial<Order>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...order,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error updating order:", error);
    return false;
  }
};

// Update order status
export const updateOrderStatus = async (
  id: string,
  status: Order["status"]
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};

// Delete order
export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    return false;
  }
};

// Get order statistics
export const getOrderStatistics = async () => {
  try {
    const allOrders = await getAllOrders();

    const stats = {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === "pending").length,
      processing: allOrders.filter((o) => o.status === "processing").length,
      completed: allOrders.filter((o) => o.status === "completed").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
      totalRevenue: allOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total, 0),
    };

    return stats;
  } catch (error) {
    console.error("Error getting order statistics:", error);
    return {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
    };
  }
};
