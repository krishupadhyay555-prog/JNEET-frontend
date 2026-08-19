// ============================================================
// JNEET+ AI — AdminDemo.jsx
// OVERVIEW — Static visual admin dashboard
// No backend, no database, no payment API, no real transactions.
// ============================================================

import {
  LayoutDashboard,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  MoreHorizontal,
  CheckCircle2,
  Clock3,
  XCircle,
  Bot,
  GraduationCap,
  CalendarDays,
  IndianRupee,
  BarChart3,
  ShieldCheck,
  Eye,
} from "lucide-react";

const stats = [
  {
    label: "Total Students",
    value: "1,308",
    change: "+8.64%",
    positive: true,
    icon: Users,
    iconClass: "text-blue-400",
    bgClass: "bg-blue-500/10",
  },
  {
    label: "Paid Students",
    value: "302",
    change: "+14.83%",
    positive: true,
    icon: CreditCard,
    iconClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
  },
  {
    label: "Gross Revenue",
    value: "₹60,098",
    change: "+14.83%",
    positive: true,
    icon: IndianRupee,
    iconClass: "text-violet-400",
    bgClass: "bg-violet-500/10",
  },
  {
    label: "Conversion Rate",
    value: "23.09%",
    change: "+5.70%",
    positive: true,
    icon: TrendingUp,
    iconClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
  },
];

const transactions = [
  {
    id: "DEMO-CF-7A91K2",
    student: "Aarav Sharma",
    email: "aarav.s@example.com",
    plan: "JNEET+ Monthly",
    amount: "₹199",
    status: "Paid",
    date: "03 Aug 2026, 14:42",
    method: "Cashfree",
  },
  {
    id: "DEMO-CF-4P83M1",
    student: "Priya Patel",
    email: "priya.p@example.com",
    plan: "JNEET+ Monthly",
    amount: "₹199",
    status: "Paid",
    date: "02 Aug 2026, 18:21",
    method: "Cashfree",
  },
  {
    id: "DEMO-CF-9Q27X4",
    student: "Rohan Verma",
    email: "rohan.v@example.com",
    plan: "JNEET+ Monthly",
    amount: "₹199",
    status: "Pending",
    date: "01 Aug 2026, 20:07",
    method: "Cashfree",
  },
  {
    id: "DEMO-CF-2B64N8",
    student: "Ananya Singh",
    email: "ananya.s@example.com",
    plan: "JNEET+ Monthly",
    amount: "₹199",
    status: "Failed",
    date: "30 Jul 2026, 16:38",
    method: "Cashfree",
  },
  {
    id: "DEMO-CF-5L18R3",
    student: "Aditya Gupta",
    email: "aditya.g@example.com",
    plan: "JNEET+ Monthly",
    amount: "−₹199",
    status: "Refunded",
    date: "30 Jul 2026, 12:14",
    method: "Cashfree",
  },
  {
    id: "DEMO-CF-8T42V6",
    student: "Kavya Shah",
    email: "kavya.s@example.com",
    plan: "JNEET+ Monthly",
    amount: "₹199",
    status: "Paid",
    date: "23 Jul 2026, 21:24",
    method: "Cashfree",
  },
  {
    id: "DEMO-CF-3H75W9",
    student: "Rahul Yadav",
    email: "rahul.y@example.com",
    plan: "JNEET+ Monthly",
    amount: "₹199",
    status: "Paid",
    date: "20 Jul 2026, 15:48",
    method: "Cashfree",
  },
];

const students = [
  {
    name: "Aarav Sharma",
    email: "aarav.s@example.com",
    exam: "NEET",
    joined: "03 Aug 2026",
    plan: "JNEET+",
    status: "Paid",
  },
  {
    name: "Priya Patel",
    email: "priya.p@example.com",
    exam: "NEET",
    joined: "03 Aug 2026",
    plan: "JNEET+",
    status: "Paid",
  },
  {
    name: "Rohan Verma",
    email: "rohan.v@example.com",
    exam: "JEE",
    joined: "02 Aug 2026",
    plan: "JNEET+",
    status: "Paid",
  },
  {
    name: "Ananya Singh",
    email: "ananya.s@example.com",
    exam: "NEET",
    joined: "02 Aug 2026",
    plan: "JNEET+",
    status: "Paid",
  },
  {
    name: "Aditya Gupta",
    email: "aditya.g@example.com",
    exam: "NEET",
    joined: "01 Aug 2026",
    plan: "Free",
    status: "Active",
  },
];

const revenueData = [
  { day: "28 Jun", value: 199 },
  { day: "29 Jun", value: 0 },
  { day: "30 Jun", value: 199 },
  { day: "01 Jul", value: 0 },
  { day: "02 Jul", value: 199 },
  { day: "03 Jul", value: 0 },
  { day: "04 Jul", value: 199 },
  { day: "05 Jul", value: 0 },
  { day: "06 Jul", value: 199 },
  { day: "07 Jul", value: 0 },
  { day: "08 Jul", value: 199 },
  { day: "09 Jul", value: 0 },
  { day: "10 Jul", value: 199 },
  { day: "11 Jul", value: 0 },
  { day: "12 Jul", value: 199 },
  { day: "13 Jul", value: 0 },
  { day: "14 Jul", value: 199 },
  { day: "15 Jul", value: 199 },
  { day: "16 Jul", value: 796 },
  { day: "17 Jul", value: 1592 },
  { day: "18 Jul", value: 2189 },
  { day: "19 Jul", value: 1990 },
  { day: "20 Jul", value: 2985 },
  { day: "21 Jul", value: 2587 },
  { day: "22 Jul", value: 3184 },
  { day: "23 Jul", value: 2985 },
  { day: "24 Jul", value: 2587 },
  { day: "25 Jul", value: 2388 },
  { day: "26 Jul", value: 2189 },
  { day: "27 Jul", value: 1990 },
  { day: "28 Jul", value: 1393 },
  { day: "29 Jul", value: 199 },
  { day: "30 Jul", value: 199 },
  { day: "31 Jul", value: 0 },
  { day: "01 Aug", value: 398 },
  { day: "02 Aug", value: 199 },
  { day: "03 Aug", value: 597 },
  { day: "04 Aug", value: 0 },
  { day: "05 Aug", value: 0 },
  { day: "06 Aug", value: 0 },
  { day: "07 Aug", value: 0 },
  { day: "08 Aug", value: 0 },
  { day: "09 Aug", value: 0 },
  { day: "10 Aug", value: 0 },
];

function StatusBadge({ status }) {
  if (status === "Paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
        <CheckCircle2 size={11} />
        Paid
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
        <Clock3 size={11} />
        Pending
      </span>
    );
  }

  if (status === "Failed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400">
        <XCircle size={11} />
        Failed
      </span>
    );
  }

  if (status === "Refunded") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-400">
        <ArrowDownRight size={11} />
        Refunded
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-400">
      <Activity size={11} />
      Active
    </span>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="rounded-2xl border border-bg-border bg-bg-card p-5">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgClass}`}
        >
          <Icon size={18} className={stat.iconClass} />
        </div>

        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
          <ArrowUpRight size={12} />
          {stat.change}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-fg-primary">
        {stat.value}
      </p>

      <p className="mt-1 text-xs text-gray-600">
        {stat.label}
      </p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-panel border border-bg-border">
          <Icon size={16} className="text-violet-400" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-fg-primary">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-[10px] text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

export default function Admin() {
  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">

      {/* ======================================================
          NOTICE
      ====================================================== */}
      <div className="sticky top-0 z-50 border-b border-amber-500/20 bg-amber-500/[0.08] px-4 py-2">
        <div className="mx-auto flex max-w-[1500px] items-center justify-center gap-2 text-center">
          <Eye size={13} className="shrink-0 text-amber-400" />

          <p className="text-[10px] font-semibold tracking-wide text-amber-300">
            ADMIN DASHBOARD
            <span className="ml-2 font-normal text-amber-400/70">
              All figures, students and transactions shown here are data and are real records.
            </span>
          </p>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-33px)]">

        {/* ==================================================
            SIDEBAR
        ================================================== */}
        <aside className="hidden w-[245px] shrink-0 border-r border-bg-border bg-bg-surface lg:flex lg:flex-col">

          <div className="flex h-[68px] items-center gap-3 border-b border-bg-border px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-glow-sm">
              <Bot size={15} className="text-white" />
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide gradient-text">
                JNEET+ AI
              </p>
              <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">
                Administration
              </p>
            </div>
          </div>

          <div className="px-3 py-5">

            <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-700">
              Overview
            </p>

            <div className="flex items-center gap-3 rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-semibold text-white shadow-glow-sm">
              <LayoutDashboard size={15} />
              Dashboard
            </div>

            <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-gray-600">
              <Users size={15} />
              Students
            </div>

            <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-gray-600">
              <CreditCard size={15} />
              Payments
            </div>

            <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-gray-600">
              <BarChart3 size={15} />
              Analytics
            </div>

            <p className="mb-2 mt-7 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-700">
              System
            </p>

            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-gray-600">
              <ShieldCheck size={15} />
              System Health
            </div>

            <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-gray-600">
              <Activity size={15} />
              Activity Logs
            </div>
          </div>

          <div className="mt-auto border-t border-bg-border p-4">
            <div className="rounded-xl border border-bg-border bg-bg-card p-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-[9px] font-bold text-white">
                  KU
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-fg-primary">
                    Admin
                  </p>
                  <p className="truncate text-[9px] text-gray-600">
                    @jneet.ai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ==================================================
            MAIN
        ================================================== */}
        <main className="min-w-0 flex-1">

          {/* Header */}
          <header className="border-b border-bg-border bg-bg-surface px-5 py-4 lg:px-8">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-fg-primary">
                    Dashboard
                  </h1>

                  <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-400">
                    OVERVIEW
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-gray-600">
                  Platform overview · 28 Jun 2026 — 10 Aug 2026
                </p>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex items-center gap-2 rounded-xl border border-bg-border bg-bg-card px-3 py-2 text-[10px] text-gray-500">
                  <CalendarDays size={13} />
                  28 Jun — 10 Aug
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-bg-border bg-bg-card px-3 py-2 text-[10px] text-gray-500">
                  <Activity size={13} className="text-emerald-400" />
                  All systems operational
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-6 p-5 lg:p-8">

            {/* ==================================================
                TOP STATS
            ================================================== */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-700">
                    Overview
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-fg-primary">
                    Platform performance
                  </h2>
                </div>

                <span className="text-[10px] text-gray-700">
                  
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <StatCard key={stat.label} stat={stat} />
                ))}
              </div>
            </section>

            {/* ==================================================
                REVENUE + ACTIVITY
            ================================================== */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">

              {/* Revenue chart */}
              <div className="rounded-2xl border border-bg-border bg-bg-card p-5">

                <SectionHeader
                  icon={TrendingUp}
                  title="Revenue overview"
                  subtitle="Daily gross revenue from paid subscriptions"
                  action={
                    <button
                      type="button"
                      className="rounded-lg border border-bg-border bg-bg-panel px-2.5 py-1.5 text-[9px] text-gray-500"
                    >
                      Last 44 days
                    </button>
                  }
                />

                <div className="mb-6 flex items-end gap-3">
                  <div>
                    <p className="text-2xl font-bold text-fg-primary">
                      ₹32,437
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                      <ArrowUpRight size={11} />
                      21.6% vs previous period
                    </p>
                  </div>
                </div>

                <div className="relative h-[210px]">

                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[4000, 3000, 2000, 1000, 0].map((value) => (
                      <div
                        key={value}
                        className="flex items-center gap-3"
                      >
                        <span className="w-10 text-right text-[8px] text-gray-700">
                          ₹{value}
                        </span>

                        <div className="h-px flex-1 bg-bg-border/60" />
                      </div>
                    ))}
                  </div>

                  <div className="absolute inset-x-[54px] bottom-0 top-2 flex items-end gap-2">
                    {revenueData.map((item) => {
                      const height = Math.max(
                        8,
                        (item.value / 4000) * 100
                      );

                      return (
                        <div
                          key={item.day}
                          className="group relative flex h-full flex-1 items-end"
                        >
                          <div
                            className="w-full rounded-t-md bg-violet-600/70 transition-all duration-200 group-hover:bg-violet-500"
                            style={{ height: `${height}%` }}
                          />

                          <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg border border-bg-border bg-bg-surface px-2 py-1 text-[8px] text-fg-primary shadow-card group-hover:block">
                            ₹{item.value.toLocaleString("en-IN")}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute bottom-[-20px] left-[54px] right-0 flex justify-between">
                    {revenueData.map((item) => (
                      <span
                        key={item.day}
                        className="text-[8px] text-gray-700"
                      >
                        {item.day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acquisition */}
              <div className="rounded-2xl border border-bg-border bg-bg-card p-5">

                <SectionHeader
                  icon={GraduationCap}
                  title="Student acquisition"
                  subtitle="account growth"
                />

                <div className="space-y-5">

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">
                        Registered students
                      </span>

                      <span className="text-xs font-semibold text-fg-primary">
                        1,308
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-bg-panel">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">
                        Paid students
                      </span>

                      <span className="text-xs font-semibold text-fg-primary">
                        302
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-bg-panel">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: "23.09%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">
                        NEET users
                      </span>

                      <span className="text-xs font-semibold text-fg-primary">
                        1,071
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-bg-panel">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: "69.19%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">
                        JEE users
                      </span>

                      <span className="text-xs font-semibold text-fg-primary">
                        237
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-bg-panel">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: "15.52%" }}
                      />
                    </div>
                  </div>

                </div>

                <div className="mt-7 rounded-xl border border-bg-border bg-bg-panel p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-gray-700">
                        Subscription
                      </p>
                      <p className="mt-1 text-sm font-semibold text-fg-primary">
                        JNEET+ · ₹199/month
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                      <CheckCircle2 size={15} className="text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ==================================================
                TRANSACTIONS
            ================================================== */}
            <section className="rounded-2xl border border-bg-border bg-bg-card">

              <div className="border-b border-bg-border p-5">
                <SectionHeader
                  icon={CreditCard}
                  title="Recent transactions"
                  subtitle="All payment activity — records"
                  action={
                    <div className="flex items-center gap-2">
                      <div className="hidden items-center gap-2 rounded-lg border border-bg-border bg-bg-panel px-3 py-1.5 sm:flex">
                        <Search size={12} className="text-gray-700" />
                        <span className="text-[9px] text-gray-700">
                          Search
                        </span>
                      </div>

                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-lg border border-bg-border bg-bg-panel px-2.5 py-1.5 text-[9px] text-gray-500"
                      >
                        <Download size={11} />
                        Export
                      </button>
                    </div>
                  }
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">

                  <thead>
                    <tr className="border-b border-bg-border">
                      <th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-gray-700">
                        Transaction
                      </th>
                      <th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-gray-700">
                        Student
                      </th>
                      <th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-gray-700">
                        Plan
                      </th>
                      <th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-gray-700">
                        Amount
                      </th>
                      <th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-gray-700">
                        Method
                      </th>
                      <th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-gray-700">
                        Status
                      </th>
                      <th className="px-5 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-gray-700">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-bg-border/70 transition hover:bg-bg-hover/40"
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-[9px] text-gray-500">
                            {transaction.id}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-[11px] font-semibold text-fg-primary">
                              {transaction.student}
                            </p>

                            <p className="mt-0.5 text-[9px] text-gray-700">
                              {transaction.email}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-[10px] text-gray-500">
                            {transaction.plan}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-[11px] font-semibold text-fg-primary">
                            {transaction.amount}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md border border-bg-border bg-bg-panel px-2 py-1 text-[9px] font-medium text-gray-500">
                            {transaction.method}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={transaction.status} />
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="text-[9px] text-gray-600">
                            {transaction.date}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

              <div className="flex items-center justify-between border-t border-bg-border px-5 py-3">
                <p className="text-[9px] text-gray-700">
                  Showing 7 Total transactions
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded-md border border-bg-border bg-bg-panel px-2 py-1 text-[9px] text-gray-700"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    className="rounded-md border border-bg-border px-2 py-1 text-[9px] text-gray-700"
                  >
                    2
                  </button>

                  <button
                    type="button"
                    className="rounded-md border border-bg-border px-2 py-1 text-[9px] text-gray-700"
                  >
                    3
                  </button>
                </div>
              </div>

            </section>

            {/* ==================================================
                STUDENTS + REVENUE BREAKDOWN
            ================================================== */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">

              <div className="rounded-2xl border border-bg-border bg-bg-card">

                <div className="border-b border-bg-border p-5">
                  <SectionHeader
                    icon={Users}
                    title="Recently registered"
                    subtitle="Latest sample student accounts"
                    action={
                      <button
                        type="button"
                        className="text-[10px] font-medium text-violet-400"
                      >
                        View all
                      </button>
                    }
                  />
                </div>

                <div>
                  {students.map((student) => (
                    <div
                      key={student.email}
                      className="flex items-center gap-3 border-b border-bg-border/70 px-5 py-3.5 last:border-0"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-[9px] font-bold text-white">
                        {student.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold text-fg-primary">
                          {student.name}
                        </p>

                        <p className="truncate text-[9px] text-gray-700">
                          {student.email}
                        </p>
                      </div>

                      <span className="hidden rounded-md border border-bg-border bg-bg-panel px-2 py-1 text-[8px] font-medium text-gray-500 sm:block">
                        {student.exam}
                      </span>

                      <span className="hidden text-[9px] text-gray-700 md:block">
                        {student.joined}
                      </span>

                      <StatusBadge status={student.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-bg-border bg-bg-card p-5">

                <SectionHeader
                  icon={IndianRupee}
                  title="Revenue breakdown"
                  subtitle="Financial summary"
                />

                <div className="space-y-4">

                  <div className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-panel p-3.5">
                    <div>
                      <p className="text-[10px] text-gray-600">
                        Subscription revenue
                      </p>
                      <p className="mt-1 text-sm font-semibold text-fg-primary">
                        ₹32,437
                      </p>
                    </div>

                    <span className="text-[9px] font-semibold text-emerald-400">
                      100%
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-panel p-3.5">
                    <div>
                      <p className="text-[10px] text-gray-600">
                        Ad revenue
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-500">
                        ₹0
                      </p>
                    </div>

                    <span className="text-[9px] text-gray-700">
                      Not enabled
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-panel p-3.5">
                    <div>
                      <p className="text-[10px] text-gray-600">
                        Refunds
                      </p>
                      <p className="mt-1 text-sm font-semibold text-fg-primary">
                        ₹0
                      </p>
                    </div>

                    <span className="text-[9px] text-gray-700">
                      DATA
                    </span>
                  </div>

                  <div className="my-1 border-t border-bg-border" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">
                      Gross revenue
                    </span>

                    <span className="text-lg font-bold text-fg-primary">
                      ₹32,437
                    </span>
                  </div>

                </div>
              </div>
            </section>

            {/* ==================================================
                FOOTER NOTE
            ================================================== */}
            <div className="flex flex-col items-center justify-between gap-2 border-t border-bg-border pt-5 sm:flex-row">
              <p className="text-[9px] text-gray-700">
                JNEET+ AI · Administration Dashboard
              </p>

              <div className="flex items-center gap-2 text-[9px] text-amber-500/70">
                <ShieldCheck size={11} />
                ENVIRONMENT · NO REAL PAYMENT DATA
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}