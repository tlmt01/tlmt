"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useGlobalContext } from "@/context/Store";

const statusOptions = [
  "Pending",
  "Cutting",
  "Stitching",
  "Trial",
  "Ready",
  "Delivered",
];

export default function ViewMyJobPage() {
  const router = useRouter();
  const { state, USER } = useGlobalContext();
  const authReady = Boolean(state?.authReady);
  const isWorker = state?.userType?.toLowerCase() === "worker";
  const isAdmin = state?.userType?.toLowerCase() === "admin";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authReady) return;
    if (!state?.loggedIn) {
      router.replace("/login");
      return;
    }
    if (!isWorker && !isAdmin) {
      router.replace("/dashboard");
      return;
    }

    const loadJobs = async () => {
      setLoading(true);
      try {
        const jobsRef = collection(firestore, "jobOrders");
        const snapshot = await getDocs(jobsRef);
        const rows = snapshot.docs.map((d) => ({ docId: d.id, ...d.data() }));

        if (isWorker) {
          const idKey = USER?.id || USER?.phone || USER?.docId;
          const mine = rows.filter((r) =>
            (r.assignedWorkerIds || []).includes(idKey),
          );
          setJobs(mine);
        } else {
          // admin: show all jobs that have any assigned workers
          const assigned = rows.filter(
            (r) => (r.assignedWorkerIds || []).length > 0,
          );
          setJobs(assigned);
        }
      } catch (err) {
        console.error(err);
        toast.error("Unable to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [authReady, isWorker, isAdmin, router, state?.loggedIn, USER]);

  const updateStatus = async (jobId, status) => {
    try {
      await updateDoc(doc(firestore, "jobOrders", jobId), { status });
      setJobs((cur) =>
        cur.map((j) => (j.docId === jobId ? { ...j, status } : j)),
      );
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Unable to update status");
    }
  };

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">My Assigned Jobs</h2>
          <p className="text-muted mb-0">
            View and update status for jobs assigned to you.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted">Loading…</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-muted">No assigned jobs found.</div>
      ) : (
        <div className="row g-3">
          {jobs.map((job) => (
            <div className="col-md-6" key={job.docId}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold mb-1">
                    {job.orderNo || job.billNo || "#"}
                  </h5>
                  <div className="small text-muted mb-2">
                    {job.customer?.name} · {job.customer?.phone}
                  </div>
                  <p className="mb-2">Delivery: {job.deliveryDate || "—"}</p>
                  <div className="d-flex gap-2 align-items-center">
                    <label className="mb-0">Status:</label>
                    <select
                      className="form-select form-select-sm"
                      value={job.status}
                      onChange={(e) => updateStatus(job.docId, e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
