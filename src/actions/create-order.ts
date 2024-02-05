"use server";

import {computeCartTotal, computeLineSubtotal} from "../hooks/use-cart";
import {CartData} from "../types";
import prisma from "../utils/prisma";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';
import {User} from "@supabase/auth-helpers-nextjs";

export async function createOrder(cart: CartData, user: User | null): Promise<{error: string | null, success: boolean}> {
  const supabase = createServerComponentClient({ cookies });
  const {data} = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (userId === undefined) return {error: "User not logged in", success: false};
  else {
    await prisma.order.create({
      data: {
        total: computeCartTotal(cart.lines),
        lines: {
          create: cart.lines.map(line => ({
            productId: line.product.id,
            qty: line.qty,
            subtotal: computeLineSubtotal(line),
          }))
        },
        userId: userId,
      }
    })

    return {error: null, success: true};
  }
}