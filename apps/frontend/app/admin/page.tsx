"use client";

import { Users, Shield, LayoutGrid, FileText } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
}

function StatCard({ icon, label, value, change }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 p-6 bg-[var(--card)] border border-[var(--border)]">
      <div className="p-3 bg-[var(--muted)] rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
        <p className="text-2xl font-semibold text-[var(--foreground)]">{value}</p>
        {change && (
          <p className="text-xs text-green-600">{change}</p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">System overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6 text-[var(--primary)]" />}
          label="Total Users"
          value={0}
          change="+0 today"
        />
        <StatCard
          icon={<Shield className="w-6 h-6 text-[var(--primary)]" />}
          label="Active Roles"
          value={0}
        />
        <StatCard
          icon={<LayoutGrid className="w-6 h-6 text-[var(--primary)]" />}
          label="System Modules"
          value={0}
        />
        <StatCard
          icon={<FileText className="w-6 h-6 text-[var(--primary)]" />}
          label="Published Templates"
          value={0}
        />
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-[var(--card)] border border-[var(--border)]">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/users"
            className="px-4 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            Manage Users
          </a>
          <a
            href="/admin/roles"
            className="px-4 py-2 text-sm bg-[var(--muted)] text-[var(--foreground)]"
          >
            Configure Roles
          </a>
          <a
            href="/admin/settings"
            className="px-4 py-2 text-sm bg-[var(--muted)] text-[var(--foreground)]"
          >
            System Settings
          </a>
        </div>
      </div>
    </div>
  );
}
