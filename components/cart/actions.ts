'use server';

import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
export const addItem = async (variantId: string | undefined, request:NextRequest): Promise<String | undefined> => {
  let cartId = request.cookies?.get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    request.cookies?.set('cartId', cartId);
  }

  if (!variantId) {
    return 'Missing product variant ID';
  }

  try {
    await addToCart(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
  } catch (e) {
    return 'Error adding item to cart';
  }
};

export const removeItem = async (lineId: string, request:NextRequest): Promise<String | undefined> => {
  const cartId = request.cookies?.get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }
  try {
    await removeFromCart(cartId, [lineId]);
  } catch (e) {
    return 'Error removing item from cart';
  }
};

export const updateItemQuantity = async ({
  lineId,
  variantId,
  quantity,
  request
}: {
  lineId: string;
  variantId: string;
  quantity: number;
  request:NextRequest
}): Promise<String | undefined> => {
  const cartId = request.cookies?.get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }
  try {
    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity
      }
    ]);
  } catch (e) {
    return 'Error updating item quantity';
  }
};
