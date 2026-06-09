import { Navigate, Outlet } from 'react-router-dom';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { useAuthStore } from './store/authStore';
import { HomePage } from './pages/customer/HomePage';
import { ProductsPage } from './pages/customer/ProductsPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { LoginPage } from './pages/customer/LoginPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProductsAdminPage } from './pages/admin/ProductsAdminPage';
import { OrdersAdminPage } from './pages/admin/OrdersAdminPage';
import { CustomersAdminPage } from './pages/admin/CustomersAdminPage';
import { DeliveryAdminPage } from './pages/admin/DeliveryAdminPage';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuthStore();
  if (loading) return <main className="p-6 text-sm font-semibold text-slate-500">Checking admin access...</main>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <AdminSidebar />
      <Outlet />
    </div>
  );
};

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/products', element: <ProductsPage /> },
  { path: '/products/:id', element: <ProductDetailPage /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/orders', element: <OrdersPage /> },
  { path: '/orders/:id', element: <OrderDetailPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <ProductsAdminPage /> },
      { path: 'orders', element: <OrdersAdminPage /> },
      { path: 'customers', element: <CustomersAdminPage /> },
      { path: 'delivery', element: <DeliveryAdminPage /> }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
];

export default routes;
