import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export type AccountEntry = {
  id: string;
  description: string;
  amount: number;
  customerName: string;
  type: "income" | "expense";
  pieceType?: string;
  category: string;
  date: string;
  source: string;
  orderNo?: string;
  orderId?: string;
  status?: string;
  advance?: number;
  due?: number;
  totalAmount?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export async function saveAccountEntry(
  entry: Partial<AccountEntry> & { id?: string },
): Promise<AccountEntry | null> {
  const docId = entry?.id || `manual-${Date.now()}`;
  const payload: AccountEntry = {
    id: docId,
    description: entry?.description || "Account entry",
    amount: Number(entry?.amount || 0),
    type: entry?.type === "expense" ? "expense" : "income",
    category: entry?.category || "General",
    date: entry?.date || new Date().toISOString().slice(0, 10),
    source: entry?.source || "manual",
    orderNo: entry?.orderNo || "",
    orderId: entry?.orderId || "",
    customerName: entry?.customerName || "Unknown",
    pieceType: entry?.pieceType || "",
    status: entry?.status || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(firestore, "accounts", docId), payload, { merge: true });

  return payload;
}

export async function upsertOrderAccountEntry(
  order: any,
): Promise<AccountEntry | null> {
  const advance = Number(order?.advance ?? order?.advancePaid ?? 0) || 0;
  const totalAmount = Number(order?.totalAmount ?? order?.total ?? 0) || 0;
  const balanceAmount = Number(order?.balance ?? order?.due ?? 0) || 0;
  const amount = advance || totalAmount || balanceAmount || 0;

  if (!amount) {
    return null;
  }

  const entryId = order?.docId
    ? `order-${order.docId}`
    : `order-${order?.orderNo || Date.now()}`;
  const entryDate =
    order?.bookingDate ||
    order?.deliveryDate ||
    new Date().toISOString().slice(0, 10);

  const due = Math.max(totalAmount - advance, balanceAmount, 0);

  const payload: AccountEntry = {
    id: entryId,
    description: `Order ${order?.orderNo || order?.docId || "payment"}`,
    amount,
    type: "income",
    category: "Order",
    date: entryDate,
    source: "jobOrder",
    orderNo: order?.orderNo || "",
    orderId: order?.docId || "",
    status: order?.status || "Pending",
    advance,
    due,
    customerName: order?.customer?.name || "Unknown",
    pieceType: order?.pieceType || "",
    totalAmount,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(firestore, "accounts", entryId), payload, { merge: true });

  return payload;
}

export async function importJobOrdersToAccounts(): Promise<AccountEntry[]> {
  const snapshot = await getDocs(collection(firestore, "jobOrders"));
  const entries: AccountEntry[] = [];

  for (const item of snapshot.docs) {
    const order = { docId: item.id, ...item.data() };
    const entry = await upsertOrderAccountEntry(order);
    if (entry) {
      entries.push(entry);
    }
  }

  return entries.sort((a, b) => {
    const aValue = a.date || "";
    const bValue = b.date || "";
    return bValue.localeCompare(aValue);
  });
}
