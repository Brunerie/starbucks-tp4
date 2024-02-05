import { ReactNode } from "react";
import { SectionContainer } from "tp-kit/components";
import prisma from "../../utils/prisma";
import { OrderTable } from "../../components/order-table";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";

export default async function Layout({ children }: { children: ReactNode }) {
    const supabase = createServerComponentClient({cookies});
    const {data} = await supabase.auth.getUser();

    const orders = await prisma.order.findMany({
        where: {
            userId: data.user?.id
        }
    });

    return (
        <div className="flex">
            <div className="w-1/3 bg-beige">
                {children}
            </div>

            <SectionContainer className="w-2/3 p-4">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <OrderTable orders={orders} />
                </div>
            </SectionContainer>
        </div>
    );
}