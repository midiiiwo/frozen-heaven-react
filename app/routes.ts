import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Customer routes
  index("routes/home.tsx"),
  route("shop", "routes/shop.tsx"),
  route("cart", "routes/cart.tsx"),

  // Admin routes
  layout("routes/admin-layout.tsx", [
    route("admin", "routes/admin/overview.tsx"),
    route("admin/analytics", "routes/admin/analytics.tsx"),
    route("admin/products", "routes/admin/products.tsx"),
    route("admin/categories", "routes/admin/categories.tsx"),
    route("admin/stock", "routes/admin/stock.tsx"),
    route("admin/orders", "routes/admin/orders.tsx"),
    route("admin/customers", "routes/admin/customers.tsx"),
    route("admin/settings", "routes/admin/settings.tsx"),
  ]),
] satisfies RouteConfig;
