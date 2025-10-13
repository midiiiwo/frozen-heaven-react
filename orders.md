# Orders Management

## Overview

Complete guide for managing orders in the Frozen Heaven system.

## Order Schema

```typescript
interface Order {
  id?: string;
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

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageName: string;
  stock: number;
  quantity: number;
}
```

## Order Lifecycle

```
pending → processing → completed
   ↓
cancelled
```

### Status Definitions

1. **Pending** - Order placed, awaiting confirmation
2. **Processing** - Order confirmed, being prepared
3. **Completed** - Order delivered successfully
4. **Cancelled** - Order cancelled by admin or customer

## API Functions

### 1. Get All Orders

Retrieves all orders, newest first.

```typescript
import { getAllOrders } from "../api/orders";

const orders = await getAllOrders();
```

**Returns:** Array of all orders with complete details.

### 2. Get Order by ID

Fetch specific order details.

```typescript
const order = await getOrderById("order123");
```

**Use Cases:**

- Order details page
- Order tracking
- Invoice generation

### 3. Get Orders by Status

Filter orders by their current status.

```typescript
const pendingOrders = await getOrdersByStatus("pending");
const completedOrders = await getOrdersByStatus("completed");
```

**Common Use Cases:**

- Admin dashboard (pending orders count)
- Order fulfillment queue
- Revenue reports (completed orders)

### 4. Get Orders by Customer

View order history for a specific customer.

```typescript
const customerOrders = await getOrdersByCustomer("john@example.com");
```

**Use Cases:**

- Customer order history
- Repeat customer identification
- Customer service lookups

### 5. Create Order

Place a new order.

```typescript
const order = await createOrder({
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+233 24 123 4567",
  customerAddress: "123 Main St, Accra",
  items: [
    {
      id: "prod1",
      name: "Chicken Wings",
      category: "Poultry Parts",
      price: 56,
      description: "Fresh chicken wings",
      imageName: "chicken-wings.png",
      stock: 70,
      quantity: 2,
    },
  ],
  subtotal: 112,
  deliveryFee: 20,
  total: 132,
  paymentMethod: "cash",
  status: "pending",
});
```

**Validation Checklist:**

- [ ] All customer fields filled
- [ ] At least one item in cart
- [ ] Correct price calculations
- [ ] Valid payment method
- [ ] Sufficient stock for all items

### 6. Update Order

Modify order details.

```typescript
await updateOrder("order123", {
  customerPhone: "+233 24 999 8888",
  status: "processing",
});
```

**Common Updates:**

- Customer contact info
- Delivery address
- Order status
- Payment method

### 7. Update Order Status

Quick status update.

```typescript
await updateOrderStatus("order123", "completed");
```

**Status Flow:**

```typescript
// Typical flow
await updateOrderStatus(id, "pending"); // Order placed
await updateOrderStatus(id, "processing"); // Order confirmed
await updateOrderStatus(id, "completed"); // Order delivered

// Cancellation
await updateOrderStatus(id, "cancelled"); // Order cancelled
```

### 8. Delete Order

Remove order from database.

```typescript
await deleteOrder("order123");
```

**Warning:** This permanently deletes the order!

**Better Alternative:** Cancel instead

```typescript
await updateOrderStatus("order123", "cancelled");
```

### 9. Get Order Statistics

Analytics and reporting data.

```typescript
const stats = await getOrderStatistics();
```

**Returns:**

```typescript
{
  total: 150,           // Total orders
  pending: 20,          // Orders pending
  processing: 30,       // Orders processing
  completed: 90,        // Orders completed
  cancelled: 10,        // Orders cancelled
  totalRevenue: 15000   // Revenue from completed orders
}
```

## React Query Hooks

### Query Hooks

#### useGetOrders

Get all orders with auto-refresh.

```typescript
import { useGetOrders } from '../hooks/useGetOrders';

function OrderList() {
  const { data: orders, isLoading, error } = useGetOrders();

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div>
      {orders?.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

**Cache Duration:** 2 minutes

#### useGetOrder

Get single order details.

```typescript
const { data: order } = useGetOrder(orderId);
```

#### useGetOrdersByStatus

Filter by status.

```typescript
const { data: pendingOrders } = useGetOrdersByStatus("pending");
const { data: completedOrders } = useGetOrdersByStatus("completed");
```

**Admin Dashboard Example:**

```typescript
function AdminDashboard() {
  const { data: pending } = useGetOrdersByStatus('pending');
  const { data: processing } = useGetOrdersByStatus('processing');

  return (
    <div>
      <StatCard title="Pending" count={pending?.length || 0} />
      <StatCard title="Processing" count={processing?.length || 0} />
    </div>
  );
}
```

#### useGetOrdersByCustomer

Customer order history.

```typescript
const { data: orders } = useGetOrdersByCustomer(customerEmail);
```

#### useGetOrderStatistics

Dashboard statistics.

```typescript
const { data: stats } = useGetOrderStatistics();
```

**Dashboard Implementation:**

```typescript
function Dashboard() {
  const { data: stats } = useGetOrderStatistics();

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total Orders" value={stats?.total} />
      <StatCard label="Pending" value={stats?.pending} />
      <StatCard label="Revenue" value={`GHC ${stats?.totalRevenue}`} />
    </div>
  );
}
```

### Mutation Hooks

#### useCreateOrder

Place new order.

```typescript
import { useCreateOrder } from '../hooks/useOrderMutations';
import { useCartStore } from '../stores/cartStore';

function CheckoutButton() {
  const createOrder = useCreateOrder();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const handleCheckout = async (customerInfo) => {
    const orderData = {
      ...customerInfo,
      items,
      subtotal: getTotalPrice(),
      deliveryFee: 20,
      total: getTotalPrice() + 20,
      paymentMethod: 'cash',
      status: 'pending'
    };

    createOrder.mutate(orderData, {
      onSuccess: (order) => {
        alert(`Order placed! ID: ${order.id}`);
        clearCart();
        navigate('/shop');
      },
      onError: () => {
        alert('Failed to place order');
      }
    });
  };

  return (
    <button
      onClick={() => handleCheckout(customerData)}
      disabled={createOrder.isPending}
    >
      {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
    </button>
  );
}
```

#### useUpdateOrder

Update order details.

```typescript
const updateOrder = useUpdateOrder();

const handleUpdateAddress = (orderId, newAddress) => {
  updateOrder.mutate({
    id: orderId,
    order: { customerAddress: newAddress },
  });
};
```

#### useUpdateOrderStatus

Change order status.

```typescript
const updateStatus = useUpdateOrderStatus();

const markAsCompleted = (orderId) => {
  updateStatus.mutate(
    {
      id: orderId,
      status: "completed",
    },
    {
      onSuccess: () => {
        alert("Order marked as completed!");
      },
    }
  );
};
```

**Admin Interface Example:**

```typescript
function OrderActions({ orderId, currentStatus }) {
  const updateStatus = useUpdateOrderStatus();

  const nextStatus = {
    pending: 'processing',
    processing: 'completed',
    completed: null
  };

  return (
    <div>
      {nextStatus[currentStatus] && (
        <button onClick={() => updateStatus.mutate({
          id: orderId,
          status: nextStatus[currentStatus]
        })}>
          Move to {nextStatus[currentStatus]}
        </button>
      )}
    </div>
  );
}
```

#### useDeleteOrder

Delete order.

```typescript
const deleteOrder = useDeleteOrder();

const handleDelete = (orderId) => {
  if (confirm("Delete this order? This cannot be undone.")) {
    deleteOrder.mutate(orderId);
  }
};
```

## Frontend Implementation

### Cart to Order Flow

```typescript
// 1. User adds items to cart (Zustand store)
const { addToCart } = useCartStore();
addToCart(product);

// 2. User views cart
const { items, getTotalPrice } = useCartStore();

// 3. User enters checkout details
const [customerInfo, setCustomerInfo] = useState({
  name: "",
  email: "",
  phone: "",
  address: "",
});

// 4. User selects payment method
const [paymentMethod, setPaymentMethod] = useState("cash");

// 5. User places order
const createOrder = useCreateOrder();
const handlePlaceOrder = async () => {
  const orderData = {
    customerName: customerInfo.name,
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
    customerAddress: customerInfo.address,
    items: items,
    subtotal: getTotalPrice(),
    deliveryFee: 20,
    total: getTotalPrice() + 20,
    paymentMethod,
    status: "pending",
  };

  const result = await createOrder.mutateAsync(orderData);

  if (result) {
    clearCart();
    navigate("/order-confirmation", { state: { orderId: result.id } });
  }
};
```

### Order Display Component

```typescript
function OrderCard({ order }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold">Order #{order.id?.slice(0, 8)}</h3>
          <p className="text-sm text-gray-600">{order.customerName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span>GHC {item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-2">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>GHC {order.total}</span>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Payment: {order.paymentMethod}</p>
        <p>Address: {order.customerAddress}</p>
        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
```

## Admin Features

### Orders Page

Location: `/admin/orders`

**Features:**

- View all orders
- Filter by status
- Search by customer name/email
- View order details
- Update order status
- Cancel orders
- Delete orders

### Status Management

```typescript
function OrderStatusManager({ order }) {
  const updateStatus = useUpdateOrderStatus();

  const statusFlow = {
    pending: { next: 'processing', color: 'yellow' },
    processing: { next: 'completed', color: 'blue' },
    completed: { next: null, color: 'green' },
    cancelled: { next: null, color: 'red' }
  };

  const handleStatusChange = (newStatus) => {
    updateStatus.mutate({
      id: order.id,
      status: newStatus
    });
  };

  return (
    <div>
      <span className={`status-badge ${statusFlow[order.status].color}`}>
        {order.status}
      </span>

      {statusFlow[order.status].next && (
        <button onClick={() => handleStatusChange(statusFlow[order.status].next)}>
          Mark as {statusFlow[order.status].next}
        </button>
      )}

      {order.status !== 'cancelled' && (
        <button onClick={() => handleStatusChange('cancelled')}>
          Cancel Order
        </button>
      )}
    </div>
  );
}
```

## Payment Methods

### Supported Methods

1. **Cash on Delivery**
   - Default option
   - Payment collected on delivery
   - No upfront payment required

2. **Mobile Money** (Coming Soon)
   - Ghana mobile money integration
   - MTN, Vodafone, AirtelTigo
   - Instant confirmation

3. **Card** (Coming Soon)
   - Credit/Debit cards
   - Secure payment gateway
   - Future implementation

### Payment Method Selection

```typescript
<select
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
>
  <option value="cash">Cash on Delivery</option>
  <option value="mobile_money">Mobile Money</option>
  <option value="card">Card (Coming Soon)</option>
</select>
```

## Best Practices

### 1. Stock Management After Order

```typescript
const createOrder = useCreateOrder();

const handleOrder = async (orderData) => {
  const result = await createOrder.mutateAsync(orderData);

  if (result) {
    // Update product stock
    for (const item of result.items) {
      const product = await getProductById(item.id);
      if (product) {
        await updateProductStock(item.id, product.stock - item.quantity);
      }
    }
  }
};
```

### 2. Order Validation

```typescript
const validateOrder = (orderData) => {
  if (!orderData.customerName) return "Name required";
  if (!orderData.customerEmail) return "Email required";
  if (!orderData.customerPhone) return "Phone required";
  if (!orderData.customerAddress) return "Address required";
  if (!orderData.items || orderData.items.length === 0) {
    return "Cart is empty";
  }

  // Validate calculations
  const calculatedSubtotal = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (calculatedSubtotal !== orderData.subtotal) {
    return "Price calculation error";
  }

  return null;
};
```

### 3. Email Confirmation (Future)

```typescript
const sendOrderConfirmation = async (order) => {
  // Send email to customer
  await sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmation #${order.id}`,
    body: `
      Thank you for your order!
      Order ID: ${order.id}
      Total: GHC ${order.total}

      Items:
      ${order.items
        .map((item) => `- ${item.name} x ${item.quantity}`)
        .join("\n")}
    `,
  });
};
```

## Reporting

### Daily Sales Report

```typescript
const getDailySales = async (date: Date) => {
  const allOrders = await getAllOrders();

  const todayOrders = allOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === date.toDateString();
  });

  const revenue = todayOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  return {
    totalOrders: todayOrders.length,
    revenue,
    pending: todayOrders.filter((o) => o.status === "pending").length,
    completed: todayOrders.filter((o) => o.status === "completed").length,
  };
};
```

### Top Customers

```typescript
const getTopCustomers = async () => {
  const allOrders = await getAllOrders();

  const customerTotals = {};
  allOrders.forEach((order) => {
    if (order.status === "completed") {
      if (!customerTotals[order.customerEmail]) {
        customerTotals[order.customerEmail] = {
          name: order.customerName,
          email: order.customerEmail,
          totalSpent: 0,
          orderCount: 0,
        };
      }
      customerTotals[order.customerEmail].totalSpent += order.total;
      customerTotals[order.customerEmail].orderCount += 1;
    }
  });

  return Object.values(customerTotals)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);
};
```

## Changelog

### [Completed]

- ✅ Complete CRUD operations
- ✅ React Query hooks
- ✅ Status management
- ✅ Customer filtering
- ✅ Order statistics
- ✅ Frontend checkout flow
- ✅ Cash payment support

### [In Progress]

- 🔄 Mobile money integration
- 🔄 Email notifications
- 🔄 SMS notifications

### [Future Enhancements]

- [ ] Order tracking
- [ ] Invoice generation
- [ ] Delivery scheduling
- [ ] Card payment integration
- [ ] Refund management
- [ ] Order notes/comments
