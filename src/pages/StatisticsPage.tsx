import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import "./StatisticsPage.css";
import { db, collection, getDocs } from "../firebase/config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getAuth } from "firebase/auth";

interface DataPoint {
  date: string;
  fuel: number;
  repair: number;
  document: number;
}

const StatisticsPage = () => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const fuelSnapshot = await getDocs(collection(db, "fuelRecords"));
      const repairSnapshot = await getDocs(collection(db, "repairRecords"));
      const documentSnapshot = await getDocs(collection(db, "documentRecords"));

      const records: Record<string, DataPoint> = {};

      fuelSnapshot.forEach((doc) => {
        const record = doc.data();
        if (record.uid === user.uid) {
          const date = record.date || "Неизвестна дата";
          const total = parseFloat(record.totalPrice) || 0;

          if (!records[date]) {
            records[date] = { date, fuel: total, repair: 0, document: 0 };
          } else {
            records[date].fuel += total;
          }
        }
      });

      repairSnapshot.forEach((doc) => {
        const record = doc.data();
        if (record.uid === user.uid) {
          const date = record.date || "Неизвестна дата";
          const total = parseFloat(record.totalPrice) || 0;

          if (!records[date]) {
            records[date] = { date, fuel: 0, repair: total, document: 0 };
          } else {
            records[date].repair += total;
          }
        }
      });

      documentSnapshot.forEach((doc) => {
        const record = doc.data();
        if (record.uid === user.uid) {
          const date = record.date || "Неизвестна дата";
          const total = parseFloat(record.totalPrice) || 0;

          if (!records[date]) {
            records[date] = { date, fuel: 0, repair: 0, document: total };
          } else {
            records[date].document += total;
          }
        }
      });

      const sortedData = Object.values(records).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setData(sortedData);
    };

    fetchData();
  }, []);

  return (
    <div className="statistics-container">
      <Navigation />
      <div className="stats-container">
        <h1>Статистика</h1>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="fuel" fill="#8884d8" name="Гориво" />
              <Bar dataKey="repair" fill="#82ca9d" name="Ремонти" />
              <Bar
                dataKey="document"
                fill="#FF8042"
                name="Разходи по документи"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
