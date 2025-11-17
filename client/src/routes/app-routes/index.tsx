import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/components/require-auth";
import { Layout } from "@/components/layout";
import { CategoryListPage } from "@/pages/category-list";
import { ProductListPage } from "@/pages/product-list";
import { ProductDetailPage } from "@/pages/product-detail";
import { CartPage } from "@/pages/cart";
import { CheckoutPage } from "@/pages/checkout";
import { OrderSuccessPage } from "@/pages/order-success";
import { OrdersPage } from "@/pages/orders";
import { AddressesPage } from "@/pages/addresses";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />

        <Route path="categories" element={<CategoryListPage />} />

        <Route path="products" element={<ProductListPage />} />
        <Route path="products/category/:categoryId" element={<ProductListPage />} />

        <Route path="product/:id" element={<ProductDetailPage />} />

        <Route path="cart" element={<CartPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />

        {/* protected */}
        <Route element={<RequireAuth />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="addresses" element={<AddressesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
