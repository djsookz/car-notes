import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const MileageContext = createContext<any>(null);

export const MileageProvider = ({ children }: { children: React.ReactNode }) => {
  const [highestMileage, setHighestMileage] = useState<number>(0);
  const [allEntries, setAllEntries] = useState<any[]>([]);

  const refreshData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return;

const collections = ['fuelRecords', 'documentRecords', 'repairRecords'];
    let entries: any[] = [];

    for (const col of collections) {
      const q = query(collection(db, col), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        entries.push({ ...doc.data(), id: doc.id });
      });
    }

    setAllEntries(entries);
    const maxMileage = Math.max(...entries.map(entry => parseFloat(entry.mileage)));
    setHighestMileage(isFinite(maxMileage) ? maxMileage : 0);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <MileageContext.Provider value={{ highestMileage, allEntries, refreshData, setHighestMileage }}>
      {children}
    </MileageContext.Provider>
  );
};

export const useMileage = () => useContext(MileageContext);