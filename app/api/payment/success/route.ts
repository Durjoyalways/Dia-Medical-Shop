import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const status = formData.get("status");
    const tran_id = formData.get("tran_id"); // আপনার অর্ডার আইডি বা ট্রানজেকশন আইডি

    if (status === "VALID") {
      // সাকসেস হলে ইউজারকে মাই অর্ডারস পেজে পাঠাবে এবং ইউআরএল-এ কিছু প্যারামিটার যোগ করবে
      return NextResponse.redirect(
        new URL(`/user/my-orders?payment=success&tranId=${tran_id}`, req.url),
        303
      );
    } else {
      return NextResponse.redirect(
        new URL(`/user/my-orders?payment=failed`, req.url),
        303
      );
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/user/cart", req.url), 303);
  }
}