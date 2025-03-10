import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import {
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "../firebase/config";
import { getAuth } from "firebase/auth";
import "./FuelPage.css";
import { useMileage } from "../utils/MileageContext";
import { validateMileage } from "../utils/validations";

interface RepairEntry {
  id?: string;
  repairType: string;
  description: string;
  mileage: string;
  date: string;
  totalPrice: string;
  comment: string;
}

const RepairPage = () => {
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [repairType, setRepairType] = useState<string>("Ремонт на двигател");
  const [description, setDescription] = useState<string>("");
  const [mileage, setMileage] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [repairEntries, setRepairEntries] = useState<RepairEntry[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { allEntries, refreshData } = useMileage();

  useEffect(() => {
    const fetchRepairEntries = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const querySnapshot = await getDocs(
        query(collection(db, "repairRecords"), where("uid", "==", user.uid))
      );

      const entries: RepairEntry[] = [];
      querySnapshot.forEach((doc) => {
        entries.push({ ...doc.data(), id: doc.id } as RepairEntry);
      });

      const sortedEntries = entries.sort((a: RepairEntry, b: RepairEntry) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      setRepairEntries(sortedEntries);
    };

    fetchRepairEntries();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!totalPrice || !repairType || !mileage || !date) {
      setErrorMessage("Моля, попълнете всички полета!");
      return;
    }

    const currentDate = new Date();
    const inputDate = new Date(date);
    const inputMileage = parseFloat(mileage);

    const validationError = validateMileage(
      inputMileage,
      inputDate,
      allEntries,
      currentDate
    );

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Няма влязъл потребител.");
      return;
    }

    const newRepairEntry: RepairEntry = {
      totalPrice,
      repairType,
      description,
      mileage,
      date,
      comment,
    };

    try {
      await addDoc(collection(db, "repairRecords"), {
        ...newRepairEntry,
        uid: user.uid,
      });

      await refreshData();
      setRepairEntries([newRepairEntry, ...repairEntries]);
      setErrorMessage("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setTotalPrice("");
    setRepairType("Ремонт на двигател");
    setDescription("");
    setMileage("");
    setDate("");
    setComment("");
    setIsModalVisible(false);
  };

  const handleDeleteEntry = async (id?: string) => {
    if (!id) {
      console.error("Опит за изтриване на запис без ID");
      return;
    }
    try {
      await deleteDoc(doc(collection(db, "repairRecords"), id));
      setRepairEntries(repairEntries.filter((entry) => entry.id !== id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleDeleteAllEntries = async () => {
    for (const entry of repairEntries) {
      if (!entry.id) continue;
      await deleteDoc(doc(db, "repairRecords", entry.id));
    }
    setRepairEntries([]);
  };

  const toggleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <div className="fuel-container">
      <Navigation />
      <div>
        <h1>Ремонти</h1>
        <p>
          Тук можеш да запишеш всички извършени ремонти и технически интервенции
          на автомобила.
        </p>
      </div>
      <button onClick={toggleModalVisibility} className="add-document-button">
        {isModalVisible ? "Затвори формата" : "Добави нов ремонт"}
      </button>

      {isModalVisible && (
        <div className={`modal-overlay ${isModalVisible ? "show" : ""}`}>
          <div className={`modal-container ${isModalVisible ? "show" : ""}`}>
            <button onClick={toggleModalVisibility} className="close-button">
              X
            </button>
            <form onSubmit={handleFormSubmit}>
              {errorMessage && (
                <div className="error-message" id="error-message">
                  {errorMessage}
                </div>
              )}
              <label>Тип ремонт:</label>
              <select
                value={repairType}
                onChange={(e) => setRepairType(e.target.value)}
              >
                <option value="Ремонт на двигател">Ремонт на двигател</option>
                <option value="Спирачна система">Спирачна система</option>
                <option value="Сцепление">Сцепление</option>
                <option value="Електрически системи">Електрически системи</option>
                <option value="Други">Други</option>
              </select>
              <label>Километраж:</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="Километраж"
              />
              <label>Дата:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <label>Обща цена:</label>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="Обща цена"
              />
              <label>Описание:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Подробно описание на ремонта"
              />
              <label>Коментар:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Допълнителни бележки"
              />
              <button type="submit">Запази</button>
            </form>
          </div>
        </div>
      )}

      <div className="fuel-table-container">
        <h2>Добавени записи:</h2>
        <table>
          <thead>
            <tr>
              <th>Тип ремонт</th>
              <th>Километраж</th>
              <th>Дата</th>
              <th>Цена</th>
              <th>Описание</th>
              <th>Коментар</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {repairEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.repairType}</td>
                <td>{entry.mileage}</td>
                <td>{entry.date}</td>
                <td>{entry.totalPrice}</td>
                <td>{entry.description}</td>
                <td>{entry.comment}</td>
                <td>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="delete-entry-button"
                  >
                    Изтрий
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="delete-button">
          {repairEntries.length > 0 && (
            <button
              onClick={handleDeleteAllEntries}
              className="delete-all-button"
            >
              Изтрий всички записи
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairPage;