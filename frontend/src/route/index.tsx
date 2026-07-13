import { Routes, Route } from 'react-router-dom';
import ProductSelect from '@/pages/ProductSelect';
import OrderForm from '@/pages/OrderForm';
import Confirm from '@/pages/Confirm';
import AdminOrders from '@/pages/AdminOrders';
import ProductCategories from '@/pages/ProductCategories';
import ProductMaster from '@/pages/ProductMaster';
import AdminGate from '@/components/layout/AdminGate';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductSelect />} />
      <Route path="/order/:productId" element={<OrderForm />} />
      <Route path="/confirm" element={<Confirm />} />
      <Route element={<AdminGate />}>
        <Route path="/admin" element={<AdminOrders />} />
        <Route path="/admin/master/product-categories" element={<ProductCategories />} />
        <Route path="/admin/master/products" element={<ProductMaster />} />
      </Route>
    </Routes>
  );
}
