"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  totalOrders?: number;
  lastOrder?: string;
}

interface Props {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onCustomerSelect: (customer: Customer) => void;
}

export default function CustomerSearch({
  phone,
  onPhoneChange,
  onCustomerSelect,
}: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (phone.length < 2) {
      setCustomers([]);
      return;
    }

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      try {
        setLoading(true);

        const q = query(
          collection(firestore, "customers"),
          orderBy("phone"),
          startAt(phone),
          endAt(phone + "\uf8ff"),
          limit(10),
        );

        const snapshot = await getDocs(q);

        const list: Customer[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Customer, "id">),
        }));

        setCustomers(list);
        setShow(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [phone]);

  return (
    <div className="position-relative">
      <label className="form-label fw-semibold">Customer Mobile Number</label>

      <input
        className="form-control form-control-lg"
        type="text"
        value={phone}
        maxLength={10}
        placeholder="Enter Mobile Number"
        onChange={(e) => {
          onPhoneChange(e.target.value.replace(/\D/g, ""));
          setShow(true);
        }}
      />

      {loading && <small className="text-secondary">Searching...</small>}

      {show && customers.length > 0 && (
        <div
          className="card shadow position-absolute w-100 mt-1"
          style={{
            zIndex: 999,
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          <div className="list-group list-group-flush">
            {customers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={() => {
                  onCustomerSelect(customer);
                  setShow(false);
                }}
              >
                <div className="d-flex justify-content-between">
                  <strong>{customer.name}</strong>

                  <span className="badge bg-success">
                    {customer.totalOrders ?? 0} Orders
                  </span>
                </div>

                <div>{customer.phone}</div>

                <small className="text-muted">{customer.address}</small>

                {customer.lastOrder && (
                  <div className="mt-1">
                    <span className="badge bg-primary">
                      Last Order : {customer.lastOrder}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
