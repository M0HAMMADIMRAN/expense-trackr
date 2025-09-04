import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [user]);

  const addExpense = async (e) => {
    e.preventDefault();
    if (!amount || !desc) return;
    await addDoc(collection(db, "users", user.uid, "expenses"), {
      amount: parseFloat(amount),
      desc,
      createdAt: serverTimestamp(),
    });
    setAmount("");
    setDesc("");
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card shadow mb-4">
          <div className="card-body">
            <h4 className="card-title">Add Expense</h4>
            <form onSubmit={addExpense}>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Expense
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">
            <h4 className="card-title">Expenses</h4>
            <ul className="list-group">
              {expenses.map((exp) => (
                <li key={exp.id} className="list-group-item d-flex justify-content-between">
                  <span>{exp.desc}</span>
                  <strong>₹{exp.amount}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
