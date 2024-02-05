"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { OrderDetailsLayout } from "tp-kit/components";
import { OrderData } from "tp-kit/types";

type Props = {
    order : any
}
export default function RealTimeOrderDetails({order} : Props) {
    const supabase = createClientComponentClient()
    const [current, setCurrent] = useState(order);
    useEffect(() => {
        const channel = supabase.channel("supabase_realtime").on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'Order',
                filter: 'id=eq.' + order.id
            },
            (payload) => {
                console.log(payload)
                if (!payload.errors) {
                    setCurrent((previous : OrderData) => ({
                        ...previous,
                        ...payload.new
                    }))
                } else {
                    console.log(payload.errors)
                    console.log(payload.new)
                }
            }
        ).subscribe()
        return() => {
            supabase.removeChannel(channel)
        }
    },[])
    return (
        <OrderDetailsLayout order={current}/>
    )
}