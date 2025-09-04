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
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Food");

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  const addExpense = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "users", user.uid, "expenses"), {
      amount: parseFloat(amount),
      desc,
      category,
      createdAt: serverTimestamp(),
    });
    setAmount("");
    setDesc("");
    setCategory("Food");
  };

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"],
      },
    ],
  };

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyTotals = Array(12).fill(0);
  expenses.forEach((e) => {
    if (e.createdAt?.toDate) {
      const m = e.createdAt.toDate().getMonth();
      monthlyTotals[m] += e.amount;
    }
  });

  const barData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyTotals,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="row">
      {/* Add Expense */}
      <div className="col-md-4">
        <div className="card shadow mb-4">
          <div className="card-body">
            <h4 className="card-title">Add Expense</h4>
            <form onSubmit={addExpense}>
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
              <select
                className="form-select mb-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Other</option>
              </select>
              <button type="submit" className="btn btn-primary w-100">
                Add Expense
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="col-md-8">
        <div className="card shadow mb-4">
          <div className="card-body">
            <h4 className="card-title">Expenses</h4>
            <ul className="list-group">
              {expenses.map((e) => (
                <li key={e.id} className="list-group-item d-flex justify-content-between">
                  <span>{e.desc} ({e.category})</span>
                  <strong>₹{e.amount}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">
            <h4 className="card-title text-center">Category Breakdown</h4>
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">
            <h4 className="card-title text-center">Monthly Expenses</h4>
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
}
