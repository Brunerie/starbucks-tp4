
import {notFound} from "next/navigation";
import {NextPageProps} from "../../../../types";
import prisma from "../../../../utils/prisma";
import RealTimeOrderDetails from "../../../../components/RealTimeOrderDetails";

type Props = {
  orderId: string;
}

export default async function OrderDetailsPage({params}: NextPageProps<Props>) {
  const orderId = parseInt(params.orderId);
  const order = await prisma.order.findUnique({
    where: {id: orderId},
    include: {
      lines: {
        include: { product: true }
      }
    }
  });

  if (!order) notFound();

  return <RealTimeOrderDetails order={order} />
}