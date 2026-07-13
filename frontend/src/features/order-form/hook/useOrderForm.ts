import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, fetchProducts, Product } from '@/api';

export function useOrderForm(productId: string | undefined) {
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts().then((list) => {
      const found = list.find((p) => p.id === productId) || null;
      setProduct(found);
    });
  }, [productId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    setSubmitting(true);
    setError('');
    try {
      const { orderId } = await createOrder({
        productId,
        customerName,
        customerEmail,
        quantity,
        notes,
        files,
      });
      navigate('/confirm', { state: { orderId } });
    } catch (e: any) {
      setError(e.message || '送信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    product,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    quantity,
    setQuantity,
    notes,
    setNotes,
    files,
    setFiles,
    submitting,
    error,
    handleSubmit,
  };
}
