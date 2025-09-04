import { useEffect, useMemo, useState } from "react";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { startOfMonth, endOfMonth, format } from "date-fns";
import {
  PieChart, Pie, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";

export default function Dashboard({ user }) {
  const [month] = useState(new Date());
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const s = startOfMonth(month);
    const e = endOfMonth(month);
    const ref = collection(db, "users", user.uid, "expenses");
    const q = query(ref, where("date", ">=", s), where("date", "<=", e), orderBy("date", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(
        snap.docs.map((d) => ({ id: d.id, ...d.data(), date: d.data().date.toDate() }))
      );
    });
    return () => unsub();
  }, [user.uid, month]);

  const total = useMemo(
    () => expenses.reduce((acc, x) => acc + Number(x.amount || 0), 0),
    [expenses]
  );

  const byCategory = useMemo(() => {
    const map = {};
    expenses.forEach((x) => {
      map[x.category] = (map[x.category] || 0) + Number(x.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const byDay = useMemo(() => {
    const map = {};
    expenses.forEach((x) => {
      const key = format(x.date, "dd");
      map[key] = (map[key] || 0) + Number(x.amount);
    });
    return Object.entries(map)
      .map(([day, amount]) => ({ day, amount }))
      .sort((a, b) => Number(a.day) - Number(b.day));
  }, [expenses]);

  // 🎨 Define colors for categories
  const COLORS = {
    Food: "#ff6b6b",
    Travel: "#4dabf7",
    Rent: "#845ef7",
    Shopping: "#f59f00",
    Bills: "#20c997",
    Other: "#adb5bd",
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">
        Dashboard — {format(month, "MMMM yyyy")} —{" "}
        <span className="text-primary">₹{total.toFixed(2)}</span>
      </h2>

      <div className="row g-4">
        {/* Add Expense Form */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <AddExpenseForm user={user} />
            </div>
          </div>
        </div>

        {/* Pie/Donut Chart */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Category Split</h5>
              <PieChart width={500} height={400}>
                <Pie
                  dataKey="value"
                  data={byCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  innerRadius={60} // makes donut style
                  paddingAngle={5}
                  label
                >
                  {byCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || "#0d6efd"} // fallback if new category
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card shadow-sm my-4">
        <div className="card-body">
          <h5 className="card-title">Daily Spend (This Month)</h5>
          <BarChart width={800} height={350} data={byDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#6610f2" />
          </BarChart>
        </div>
      </div>

      {/* Expense Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <ExpenseList user={user} />
        </div>
      </div>
    </div>
  );
}
