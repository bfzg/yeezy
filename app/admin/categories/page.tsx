import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminCategoryManager } from "@/components/AdminCategoryManager";
import { StoreChrome } from "@/components/Chrome";
import { requireAdmin } from "@/lib/auth";
import { getAdminProductCategories, getCart, getSessionId } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const sessionId = await getSessionId();
  const cart = getCart(sessionId);
  const categories = getAdminProductCategories();

  return (
    <main className="max-w-[1180px] mx-auto shell admin-shell">
      <StoreChrome cartCount={cart.reduce((sum, line) => sum + line.quantity, 0)} backHref="/admin" />
      <section className="admin-header">
        <div>
          <h1>分类管理</h1>
          <p>删除分类 / 处理分类商品</p>
        </div>
        <div className="admin-header-actions">
          <Link className="text-button" href="/admin">商品列表</Link>
          <Link className="text-button" href="/admin/products/new">新增商品</Link>
        </div>
      </section>
      <AdminCategoryManager categories={categories} />
    </main>
  );
}
