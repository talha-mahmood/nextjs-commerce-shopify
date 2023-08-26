import { getCart } from 'lib/shopify';
import { NextRequest } from 'next/server';
import CartModal from './modal';

export default async function Cart(request: NextRequest) {
  const cartId = request.cookies?.get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <CartModal cart={cart} />;
}
