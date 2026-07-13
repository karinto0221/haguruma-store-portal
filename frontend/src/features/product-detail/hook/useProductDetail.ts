import { useEffect, useState } from 'react';
import { fetchProduct, Product } from '@/api';

export function useProductDetail(productId: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;
    fetchProduct(productId).then(setProduct).catch((e) => setError(e.message));
  }, [productId]);

  return {
    product,
    quantity,
    setQuantity,
    error,
  };
}
