# Frozen Heaven - API Documentation

## Table of Contents

1. [Products API](#products-api)
2. [Orders API](#orders-api)
3. [Categories API](#categories-api)
4. [Customers API](#customers-api)
5. [Hooks Usage](#hooks-usage)

---

## Products API

### Get All Products

```typescript
import { getAllProducts } from "../api/products";

const products = await getAllProducts();
```

**Returns:** `Promise<Product[]>`

**Example Response:**

```json
[
  {
    "id": "abc123",
    "name": "Layer Chicken (Hard)",
    "category": "Poultry",
    "price": 48,
    "description": "Premium quality layer chicken",
    "imageName": "layer-chicken.png",
    "stock": 50,
    "createdAt": "2025-10-13T00:00:00.000Z",
    "updatedAt": "2025-10-13T00:00:00.000Z"
  }
]
```

### Get Product by ID

```typescript
import { getProductById } from "../api/products";

const product = await getProductById("abc123");
```

**Parameters:**

- `id` (string): Product ID

**Returns:** `Promise<Product | null>`

### Get Products by Category

```typescript
import { getProductsByCategory } from "../api/products";

const products = await getProductsByCategory("Poultry");
```

**Parameters:**

- `category` (string): Category name or "All"

**Returns:** `Promise<Product[]>`

### Create Product

```typescript
import { createProduct } from "../api/products";

const newProduct = await createProduct({
  name: "Chicken Wings",
  category: "Poultry Parts",
  price: 56,
  description: "Fresh chicken wings",
  imageName: "chicken-wings.png",
  stock: 70,
});
```

**Parameters:**

- `product` (Omit<Product, 'id'>): Product data without ID

**Returns:** `Promise<Product | null>`

**Note:** The collection will be automatically created if it doesn't exist.

### Update Product

```typescript
import { updateProduct } from "../api/products";

const success = await updateProduct("abc123", {
  price: 60,
  stock: 80,
});
```

**Parameters:**

- `id` (string): Product ID
- `product` (Partial<Product>): Fields to update

**Returns:** `Promise<boolean>`

### Delete Product

```typescript
import { deleteProduct } from "../api/products";

const success = await deleteProduct("abc123");
```

**Parameters:**

- `id` (string): Product ID

**Returns:** `Promise<boolean>`

### Update Product Stock

```typescript
import { updateProductStock } from "../api/products";

const success = await updateProductStock("abc123", 100);
```

**Parameters:**

- `id` (string): Product ID
- `stock` (number): New stock quantity

**Returns:** `Promise<boolean>`

### Search Products

```typescript
import { searchProducts } from "../api/products";

const results = await searchProducts("chicken");
```

**Parameters:**

- `searchTerm` (string): Search query

**Returns:** `Promise<Product[]>`

**Note:** Searches in name, description, and category fields.

---

## Orders API

### Get All Orders

```typescript
import { getAllOrders } from "../api/orders";

const orders = await getAllOrders();
```

**Returns:** `Promise<Order[]>`

**Example Response:**

```json
[
  {
    "id": "order123",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+233 XX XXX XXXX",
    "customerAddress": "123 Main St, Accra",
    "items": [
      {
        "id": "product1",
        "name": "Chicken Wings",
        "price": 56,
        "quantity": 2
      }
    ],
    "subtotal": 112,
    "deliveryFee": 20,
    "total": 132,
    "paymentMethod": "cash",
    "status": "pending",
    "createdAt": "2025-10-13T00:00:00.000Z",
    "updatedAt": "2025-10-13T00:00:00.000Z"
  }
]
```

### Get Order by ID

```typescript
import { getOrderById } from "../api/orders";

const order = await getOrderById("order123");
```

**Parameters:**

- `id` (string): Order ID

**Returns:** `Promise<Order | null>`

### Get Orders by Status

```typescript
import { getOrdersByStatus } from "../api/orders";

const pendingOrders = await getOrdersByStatus("pending");
```

**Parameters:**

- `status` (string): One of 'pending' | 'processing' | 'completed' | 'cancelled'

**Returns:** `Promise<Order[]>`

### Get Orders by Customer

```typescript
import { getOrdersByCustomer } from "../api/orders";

const customerOrders = await getOrdersByCustomer("john@example.com");
```

**Parameters:**

- `customerEmail` (string): Customer email address

**Returns:** `Promise<Order[]>`

### Create Order

```typescript
import { createOrder } from "../api/orders";

const newOrder = await createOrder({
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+233 XX XXX XXXX",
  customerAddress: "123 Main St",
  items: [
    {
      id: "product1",
      name: "Chicken Wings",
      price: 56,
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

**Parameters:**

- `order` (Omit<Order, 'id'>): Order data without ID

**Returns:** `Promise<Order | null>`

### Update Order

```typescript
import { updateOrder } from "../api/orders";

const success = await updateOrder("order123", {
  status: "processing",
});
```

**Parameters:**

- `id` (string): Order ID
- `order` (Partial<Order>): Fields to update

**Returns:** `Promise<boolean>`

### Update Order Status

```typescript
import { updateOrderStatus } from "../api/orders";

const success = await updateOrderStatus("order123", "completed");
```

**Parameters:**

- `id` (string): Order ID
- `status` (string): One of 'pending' | 'processing' | 'completed' | 'cancelled'

**Returns:** `Promise<boolean>`

### Delete Order

```typescript
import { deleteOrder } from "../api/orders";

const success = await deleteOrder("order123");
```

**Parameters:**

- `id` (string): Order ID

**Returns:** `Promise<boolean>`

### Get Order Statistics

```typescript
import { getOrderStatistics } from "../api/orders";

const stats = await getOrderStatistics();
```

**Returns:** `Promise<OrderStats>`

**Example Response:**

```json
{
  "total": 150,
  "pending": 20,
  "processing": 30,
  "completed": 90,
  "cancelled": 10,
  "totalRevenue": 15000
}
```

---

## Categories API

### Get All Categories

```typescript
import { getAllCategories } from "../api/categories";

const categories = await getAllCategories();
```

**Returns:** `Promise<Category[]>`

### Get Category by ID

```typescript
import { getCategoryById } from "../api/categories";

const category = await getCategoryById("cat123");
```

**Parameters:**

- `id` (string): Category ID

**Returns:** `Promise<Category | null>`

### Create Category

```typescript
import { createCategory } from "../api/categories";

const newCategory = await createCategory({
  name: "Poultry",
  description: "Chicken and poultry products",
});
```

**Parameters:**

- `category` (Omit<Category, 'id'>): Category data without ID

**Returns:** `Promise<Category | null>`

### Update Category

```typescript
import { updateCategory } from "../api/categories";

const success = await updateCategory("cat123", {
  description: "Updated description",
});
```

**Parameters:**

- `id` (string): Category ID
- `category` (Partial<Category>): Fields to update

**Returns:** `Promise<boolean>`

### Delete Category

```typescript
import { deleteCategory } from "../api/categories";

const success = await deleteCategory("cat123");
```

**Parameters:**

- `id` (string): Category ID

**Returns:** `Promise<boolean>`

---

## Customers API

### Get All Customers

```typescript
import { getAllCustomers } from "../api/customers";

const customers = await getAllCustomers();
```

**Returns:** `Promise<Customer[]>`

### Get Customer by ID

```typescript
import { getCustomerById } from "../api/customers";

const customer = await getCustomerById("cust123");
```

**Parameters:**

- `id` (string): Customer ID

**Returns:** `Promise<Customer | null>`

### Get Customer by Email

```typescript
import { getCustomerByEmail } from "../api/customers";

const customer = await getCustomerByEmail("john@example.com");
```

**Parameters:**

- `email` (string): Customer email

**Returns:** `Promise<Customer | null>`

### Create Customer

```typescript
import { createCustomer } from "../api/customers";

const newCustomer = await createCustomer({
  name: "John Doe",
  email: "john@example.com",
  phone: "+233 XX XXX XXXX",
  address: "123 Main St, Accra",
});
```

**Parameters:**

- `customer` (Omit<Customer, 'id'>): Customer data without ID

**Returns:** `Promise<Customer | null>`

### Update Customer

```typescript
import { updateCustomer } from "../api/customers";

const success = await updateCustomer("cust123", {
  phone: "+233 YY YYY YYYY",
});
```

**Parameters:**

- `id` (string): Customer ID
- `customer` (Partial<Customer>): Fields to update

**Returns:** `Promise<boolean>`

### Delete Customer

```typescript
import { deleteCustomer } from "../api/customers";

const success = await deleteCustomer("cust123");
```

**Parameters:**

- `id` (string): Customer ID

**Returns:** `Promise<boolean>`

### Search Customers

```typescript
import { searchCustomers } from "../api/customers";

const results = await searchCustomers("john");
```

**Parameters:**

- `searchTerm` (string): Search query

**Returns:** `Promise<Customer[]>`

---

## Hooks Usage

### Product Hooks

#### Query Hooks

```typescript
import {
  useGetProducts,
  useGetProduct,
  useGetProductsByCategory,
} from "../hooks/useGetProducts";

// Get all products
const { data: products, isLoading, error } = useGetProducts();

// Get single product
const { data: product } = useGetProduct("abc123");

// Get products by category
const { data: categoryProducts } = useGetProductsByCategory("Poultry");
```

#### Mutation Hooks

```typescript
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductStock,
} from "../hooks/useProductMutations";

// Create product
const createMutation = useCreateProduct();
createMutation.mutate({
  name: "New Product",
  category: "Poultry",
  price: 50,
  description: "Description",
  imageName: "product.png",
  stock: 100,
});

// Update product
const updateMutation = useUpdateProduct();
updateMutation.mutate({
  id: "abc123",
  product: { price: 60 },
});

// Delete product
const deleteMutation = useDeleteProduct();
deleteMutation.mutate("abc123");

// Update stock
const stockMutation = useUpdateProductStock();
stockMutation.mutate({ id: "abc123", stock: 50 });
```

### Order Hooks

#### Query Hooks

```typescript
import {
  useGetOrders,
  useGetOrder,
  useGetOrdersByStatus,
  useGetOrderStatistics,
} from "../hooks/useGetOrders";

// Get all orders
const { data: orders } = useGetOrders();

// Get single order
const { data: order } = useGetOrder("order123");

// Get orders by status
const { data: pendingOrders } = useGetOrdersByStatus("pending");

// Get statistics
const { data: stats } = useGetOrderStatistics();
```

#### Mutation Hooks

```typescript
import {
  useCreateOrder,
  useUpdateOrder,
  useUpdateOrderStatus,
  useDeleteOrder,
} from "../hooks/useOrderMutations";

// Create order
const createMutation = useCreateOrder();
createMutation.mutate({
  customerName: "John",
  customerEmail: "john@example.com",
  // ... other fields
});

// Update order status
const statusMutation = useUpdateOrderStatus();
statusMutation.mutate({ id: "order123", status: "completed" });
```

### Category Hooks

```typescript
import { useGetCategories } from "../hooks/useGetCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategoryMutations";

// Get categories
const { data: categories } = useGetCategories();

// Mutations
const createMutation = useCreateCategory();
const updateMutation = useUpdateCategory();
const deleteMutation = useDeleteCategory();
```

### Customer Hooks

```typescript
import { useGetCustomers } from "../hooks/useGetCustomers";
import {
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../hooks/useCustomerMutations";

// Get customers
const { data: customers } = useGetCustomers();

// Mutations
const createMutation = useCreateCustomer();
const updateMutation = useUpdateCustomer();
const deleteMutation = useDeleteCustomer();
```

---

## Image Handling

### Product Images

Product images are stored locally in the `src/assets/products/` directory. When creating a product, only store the image filename (e.g., `chicken-wings.png`), not the full path.

```typescript
// When creating a product
{
  imageName: "chicken-wings.png"; // Just the filename
}

// The system will automatically look for the image at:
// /assets/products/chicken-wings.png

// If the image is not found, a default placeholder is used
```

**Default Image Path:** `/images/default-product.png`

---

## Database Seeding

### Seed Database Function

To populate the database with initial data:

```typescript
import { seedDatabase } from "../lib/seed/seedDatabase";

const result = await seedDatabase();
// Returns: { success: boolean, message: string }
```

**What it seeds:**

- 22 Products (from the price list)
- 8 Categories

**Admin Interface:**
Navigate to `/admin/settings` and click the "Seed Database" button.

---

## Error Handling

All API functions return `null` or `false` on error and log errors to the console. Always check return values:

```typescript
const product = await getProductById("abc123");
if (!product) {
  // Handle error
  console.error("Product not found");
}

const success = await updateProduct("abc123", { price: 60 });
if (!success) {
  // Handle error
  console.error("Failed to update product");
}
```

---

## Firebase Configuration

Configure Firebase in `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Collections Created Automatically:**

- `products`
- `orders`
- `categories`
- `customers`

No manual Firestore setup required!
