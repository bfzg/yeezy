import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { AdminSettingsTabs } from "@/components/AdminSettingsTabs";
import { StoreChrome } from "@/components/Chrome";
import { requireAdmin } from "@/lib/auth";
import { getCart, getPaymentSettings, getSessionId } from "@/lib/db";

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const sessionId = await getSessionId();
  const cart = getCart(sessionId);
  const settings = getPaymentSettings();
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const webhookUrl = `${protocol}://${host}/api/webhooks/paypal`;

  return (
    <main className="shell admin-shell">
      <StoreChrome cartCount={cart.reduce((sum, line) => sum + line.quantity, 0)} backHref="/admin" />
      <section className="admin-header">
        <div>
          <h1>设置</h1>
          <p>支付 / 管理员</p>
        </div>
        <div className="admin-header-actions">
          <Link className="text-button" href="/admin">商品列表</Link>
          <Link className="text-button" href="/admin/orders">订单管理</Link>
        </div>
      </section>
      <AdminSettingsTabs
        admin={{ email: admin.email, name: admin.name }}
        paymentSettings={settings}
        webhookUrl={webhookUrl}
      />
    </main>
  );
}
