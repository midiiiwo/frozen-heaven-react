interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageName: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Category {
  id?: string | undefined;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CartItem extends Product {
  quantity: number;
}

interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Order {
  id?: string | undefined;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cash" | "card" | "mobile_money";
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderStatus {
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
}

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  ordersByStatus: OrderStatus;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger" | "success" | "warning";
  isLoading?: boolean;
}
