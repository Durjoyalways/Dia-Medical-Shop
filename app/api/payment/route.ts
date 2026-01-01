import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const formData = new URLSearchParams();
    formData.append('store_id', process.env.NEXT_PUBLIC_SSL_STORE_ID!);
    formData.append('store_passwd', process.env.NEXT_PUBLIC_SSL_STORE_PASSWORD!);
    formData.append('total_amount', body.totalAmount.toString());
    formData.append('currency', 'BDT');
    formData.append('tran_id', body.tranId);
    formData.append('success_url', `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`);
    formData.append('fail_url', `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`);
    formData.append('cancel_url', `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`);
    formData.append('ipn_url', `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`);
    formData.append('cus_name', body.cus_name);
    formData.append('cus_email', body.cus_email);
    formData.append('cus_phone', body.cus_phone);
    formData.append('cus_add1', body.address || 'Dhaka');
    formData.append('cus_city', 'Dhaka');
    formData.append('cus_country', 'Bangladesh');
    formData.append('shipping_method', 'NO');
    formData.append('product_name', 'Medicine');
    formData.append('product_category', 'Healthcare');
    formData.append('product_profile', 'general');

    // SSLCommerz Sandbox URL
    const response = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    const result = await response.json();

    if (result.status === "SUCCESS") {
      return NextResponse.json({ url: result.GatewayPageURL });
    } else {
      return NextResponse.json({ error: result.failedreason }, { status: 400 });
    }
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}