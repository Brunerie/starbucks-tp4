import {NextRequest, NextResponse} from "next/server";
import {revalidatePath} from "next/cache";
export async function POST(request: NextRequest) {
    const apiKey = process.env.SUPABASE_WEBHOOK_KEY;

    if (!request.headers.has('API-Key')) {
        return NextResponse.json({message : "\"API-Key\" header is missing"}, {status: 401});
    }
    if (request.headers.get('API-Key') !== apiKey) {
        return NextResponse.json({message : "API Key is not valid"}, {status: 403});
    }

    console.log(request.headers);

    console.log("rebuilding posts...");
    revalidatePath("[categorySlug]/[productSlug]");

    return NextResponse.json({
        "revalidated": true,
        "date": "2023-08-16T14:22:44.119Z"
    });
}