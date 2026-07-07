"use client";

import { useState } from "react";
import { AdminAccountSettings } from "@/components/AdminAccountSettings";
import { AdminPaymentSettings } from "@/components/AdminPaymentSettings";
import type { PaymentSettings } from "@/lib/db";

type AdminAccount = {
  email: string;
  name: string;
};

export function AdminSettingsTabs({
  admin,
  paymentSettings,
  webhookUrl,
}: {
  admin: AdminAccount;
  paymentSettings: PaymentSettings;
  webhookUrl: string;
}) {
  const [activeTab, setActiveTab] = useState<"payments" | "account">("payments");

  return (
    <section className="settings-tabs">
      <div className="settings-tab-list" role="tablist" aria-label="设置分类">
        <button
          aria-selected={activeTab === "payments"}
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
          role="tab"
          type="button"
        >
          支付设置
        </button>
        <button
          aria-selected={activeTab === "account"}
          className={activeTab === "account" ? "active" : ""}
          onClick={() => setActiveTab("account")}
          role="tab"
          type="button"
        >
          管理员设置
        </button>
      </div>
      <div className="settings-tab-panel" role="tabpanel">
        {activeTab === "payments" ? (
          <AdminPaymentSettings initialSettings={paymentSettings} webhookUrl={webhookUrl} />
        ) : (
          <AdminAccountSettings admin={admin} />
        )}
      </div>
    </section>
  );
}
