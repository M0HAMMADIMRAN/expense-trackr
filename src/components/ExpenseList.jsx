import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, limit } from "firebase/firestore";

export default function ExpenseList({ user }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const expensesRef = collection(db, "users", user.uid, "expenses");
    const q = query(expensesRef, orderBy("date", "desc"), limit(100));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user.uid]);

  const remove = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "expenses", id));
  };

  return (
    <div>
      <h5 className="mb-3">📋 Recent Expenses</h5>
      <table className="table table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>₹{it.amount}</td>
              <td>{it.category}</td>
              <td>{it.date?.toDate?.().toLocaleDateString?.()}</td>
              <td>{it.note}</td>
              <td>
                <button onClick={() => remove(it.id)} className="btn btn-sm btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
