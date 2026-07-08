'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ShoppingBag, Plus, Package, X, ShoppingCart } from 'lucide-react';

export default function ShopDashboardPage() {
  const { accessToken } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: 0, stockQuantity: 0 });

  const companyId = '5cfdaaa5-9cfa-4e5e-a14c-3dbe2d2f6bf4';

  const fetchProducts = () => {
    if (!accessToken) return;
    fetch(`/api/shop/${companyId}/products`, {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'user-role': 'COMPANY_ADMIN' }
    })
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
  };

  const fetchOrders = (productId: string) => {
    fetch(`/api/shop/products/${productId}/orders`, {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'user-role': 'COMPANY_ADMIN' }
    })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []));
  };

  useEffect(() => { fetchProducts(); }, [accessToken]);

  const handleCreateProduct = async () => {
    await fetch(`/api/shop/${companyId}/products`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'Content-Type': 'application/json', 'user-role': 'COMPANY_ADMIN' },
      body: JSON.stringify(productForm)
    });
    setShowProductForm(false);
    setProductForm({ name: '', description: '', price: 0, stockQuantity: 0 });
    fetchProducts();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-amber-50 text-amber-700',
      'CONFIRMED': 'bg-blue-50 text-blue-700',
      'SHIPPED': 'bg-violet-50 text-violet-700',
      'DELIVERED': 'bg-emerald-50 text-emerald-700',
      'CANCELLED': 'bg-red-50 text-red-600',
    };
    return colors[status] || 'bg-gray-50 text-gray-600';
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
            <ShoppingBag size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">المنتجات والطلبات</h1>
            <p className="text-gray-500 mt-0.5">{products.length} منتج</p>
          </div>
        </div>
        <button onClick={() => setShowProductForm(!showProductForm)} className="bg-[#128C4F] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg">
          <Plus size={18} /> إضافة منتج
        </button>
      </div>

      {/* Product Form */}
      {showProductForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
          <div className="flex justify-between"><h3 className="font-bold text-gray-900">منتج جديد</h3><button onClick={() => setShowProductForm(false)}><X size={18} className="text-gray-400" /></button></div>
          <input placeholder="اسم المنتج" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="السعر" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
            <input type="number" placeholder="الكمية" value={productForm.stockQuantity} onChange={e => setProductForm({...productForm, stockQuantity: Number(e.target.value)})} className="border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
          </div>
          <button onClick={handleCreateProduct} className="w-full bg-[#128C4F] text-white py-3 rounded-xl font-bold">إضافة المنتج</button>
        </div>
      )}

      {/* Products + Orders */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center">
          <ShoppingBag size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">لا توجد منتجات بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p: any) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => { setSelectedProduct(p.id); fetchOrders(p.id); }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#128C4F]/10 flex items-center justify-center">
                    <Package size={18} className="text-[#128C4F]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                    <p className="text-gray-500 text-sm">المخزون: {p.stock_quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#128C4F] font-bold text-xl">{p.price} ل.س</p>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(p.id); fetchOrders(p.id); }} className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                    <ShoppingCart size={14} /> الطلبات
                  </button>
                </div>
              </div>
              {selectedProduct === p.id && orders.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <h4 className="font-bold text-gray-900 mb-3">الطلبات ({orders.length})</h4>
                  <div className="space-y-2">
                    {orders.map((o: any) => (
                      <div key={o.id} className="bg-white rounded-xl p-4 border border-gray-200 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{o.quantity}x منتج</p>
                          <p className="text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 font-bold">{o.total_price} ل.س</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(o.status)}`}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}