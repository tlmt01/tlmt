"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useGlobalContext } from "../../context/Store";
import { importJobOrdersToAccounts, saveAccountEntry } from "@/lib/accounts";
import styles from "./accounts.module.css";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AccountsPage() {
  const router = useRouter();
  const { state, USER } = useGlobalContext();
  const isAdmin = state?.userType?.toLowerCase() === "admin";
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "income",
    category: "Sales",
  });

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(firestore, "accounts"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rows = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setTransactions(rows);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const bootstrapAccounts = async () => {
      try {
        await importJobOrdersToAccounts();
      } catch (error) {
        console.warn("Unable to sync orders to accounts", error);
      }
    };

    bootstrapAccounts();
  }, [isAdmin]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((entry) => entry.type === "income")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    const expenses = transactions
      .filter((entry) => entry.type === "expense")
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    const balance = income - expenses;
    const savingsRate = income ? Math.round((balance / income) * 100) : 0;
    const receivedAdvance = transactions
      .filter((entry) => entry.source === "jobOrder")
      .reduce((sum, entry) => sum + Number(entry.advance || 0), 0);
    const dueBalance = transactions
      .filter((entry) => entry.source === "jobOrder")
      .reduce((sum, entry) => sum + Number(entry.due || 0), 0);

    return {
      income,
      expenses,
      balance,
      savingsRate,
      receivedAdvance,
      dueBalance,
    };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 5);
  }, [transactions]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.description.trim() || !form.amount) return;

    const nextEntry = {
      id: Date.now().toString(),
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category.trim() || "General",
      date: new Date().toISOString().slice(0, 10),
      source: "manual",
    };

    try {
      const savedEntry = await saveAccountEntry(nextEntry);
      if (savedEntry) {
        setTransactions((current) => [savedEntry, ...current]);
      }
      setForm({
        description: "",
        amount: "",
        type: "income",
        category: "Sales",
      });
    } catch (error) {
      console.warn("Unable to save account entry", error);
    }
  };

  const removeTransaction = async (id) => {
    try {
      await deleteDoc(doc(firestore, "accounts", id));
      setTransactions((current) => current.filter((entry) => entry.id !== id));
    } catch (error) {
      console.warn("Unable to remove account entry", error);
    }
  };

  const syncExistingOrders = async () => {
    if (!isAdmin) return;

    setSyncing(true);
    try {
      await importJobOrdersToAccounts();
    } catch (error) {
      console.warn("Unable to sync orders to accounts", error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>CASH FLOW</p>
          <h1>Keep your money calm, clear, and growing.</h1>
          <p>
            View your monthly income, track every expense, and stay ahead of
            every decision with a polished account overview.
          </p>
          <div className={styles.heroActions}>
            <Link href="/dashboard" className={styles.secondaryLink}>
              Back to dashboard
            </Link>
            <button
              type="button"
              className={styles.syncButton}
              onClick={syncExistingOrders}
              disabled={syncing}
            >
              {syncing ? "Syncing orders..." : "Sync existing orders"}
            </button>
            <span className={styles.liveBadge}>● Live overview</span>
          </div>
        </div>

        <div className={styles.heroCard}>
          <span className={styles.label}>Net balance</span>
          <strong>{formatCurrency(totals.balance)}</strong>
          <p>
            {totals.savingsRate >= 0
              ? `${totals.savingsRate}% of income retained`
              : "Review spending to improve momentum"}
          </p>
        </div>
      </section>

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <div>
            <span>Total income</span>
            <strong>{formatCurrency(totals.income)}</strong>
          </div>
          <i className="bi bi-arrow-up-circle" />
        </article>
        <article className={styles.summaryCard}>
          <div>
            <span>Advance received</span>
            <strong>{formatCurrency(totals.receivedAdvance)}</strong>
          </div>
          <i className="bi bi-cash-stack" />
        </article>
        <article className={styles.summaryCard}>
          <div>
            <span>Due balance</span>
            <strong>{formatCurrency(totals.dueBalance)}</strong>
          </div>
          <i className="bi bi-receipt-cutoff" />
        </article>
        <article className={styles.summaryCard}>
          <div>
            <span>Current balance</span>
            <strong>{formatCurrency(totals.balance)}</strong>
          </div>
          <i className="bi bi-wallet2" />
        </article>
      </section>

      <section className={styles.contentGrid}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>ADD ENTRY</p>
              <h2>Track a new flow</h2>
            </div>
            <span className={styles.softBadge}>Instant update</span>
          </div>

          <label>
            <span>Description</span>
            <input
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="e.g. Custom gown booking"
              required
            />
          </label>

          <label>
            <span>Amount</span>
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  amount: event.target.value,
                }))
              }
              placeholder="0"
              required
            />
          </label>

          <div className={styles.inlineFields}>
            <label>
              <span>Type</span>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    type: event.target.value,
                  }))
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label>
              <span>Category</span>
              <input
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                placeholder="Sales"
              />
            </label>
          </div>

          <button type="submit">Save entry</button>
        </form>

        <div className={styles.listCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardEyebrow}>RECENT ACTIVITY</p>
              <h2>Latest movement</h2>
            </div>
            <span className={styles.softBadge}>Updated instantly</span>
          </div>

          <ul className={styles.transactionList}>
            {loading ? (
              <li className={styles.emptyState}>Loading account activity...</li>
            ) : recentTransactions.length === 0 ? (
              <li className={styles.emptyState}>No account entries yet.</li>
            ) : (
              recentTransactions.map((entry) => (
                <li key={entry.id}>
                  <div>
                    <strong>{entry.description}</strong>
                    <span>
                      {entry.category} • {entry.date}
                    </span>
                    {entry.source === "jobOrder" ? (
                      <div className={styles.orderMeta}>
                        <span>
                          Advance: {formatCurrency(entry.advance || 0)}
                        </span>
                        <span>Due: {formatCurrency(entry.due || 0)}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.transactionMeta}>
                    <span
                      className={
                        entry.type === "income" ? styles.income : styles.expense
                      }
                    >
                      {entry.type === "income" ? "+" : "-"}
                      {formatCurrency(entry.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTransaction(entry.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
