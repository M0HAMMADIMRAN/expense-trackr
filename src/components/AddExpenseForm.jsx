import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { formatISO } from "date-fns";

const CATEGORIES = ["Food", "Travel", "Rent", "Shopping", "Bills", "Other"];

export default function AddExpenseForm({ user }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(() => formatISO(new Date(), { representation: "date" }));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const expensesRef = collection(db, "users", user.uid, "expenses");
      await addDoc(expensesRef, {
        amount: Number(amount),
        category,
        note,
        date: new Date(date),
        createdAt: serverTimestamp(),
      });
      setAmount("");
      setNote("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h5 className="mb-3">➕ Add Expense</h5>

      <div className="mb-3">
        <label className="form-label">Amount (₹)</label>
        <input type="number" className="form-control" value={amount}
          onChange={(e) => setAmount(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select className="form-select" value={category}
          onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Date</label>
        <input type="date" className="form-control" value={date}
          onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Note</label>
        <input className="form-control" value={note}
          onChange={(e) => setNote(e.target.value)} />
      </div>

      {err && <div className="text-danger mb-2">{err}</div>}

      <button type="submit" className="btn btn-primary w-100" disabled={saving}>
        {saving ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
}
