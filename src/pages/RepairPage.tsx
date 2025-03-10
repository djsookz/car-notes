import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import "./FuelPage.css";
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

interface repairEntry {
  id?: string;
  serviceName: string;
  mileage: string;
  date: string;
  parts: string;
  labour: string;
  totalPrice: string;
  comment: string;
}

const FuelPage = () => {
  const [parts, setParts] = useState<string>("");
  const [labour, setLabour] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [mileage, setMileage] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [repairEntries, setRepairEntries] = useState<repairEntry[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Състояние за видимост на модалния прозорец

  const calculateTotalPrice = (price: number, labour: number) => {
    return (price + labour).toFixed(2);
  };

  useEffect(() => {
    if (parts && labour) {
      const price = parseFloat(parts) || 0;
      const liter = parseFloat(labour) || 0;
      setTotalPrice(calculateTotalPrice(price, liter));
    }
  }, [parts, labour]);

  // Зареждаме данни от Firebase
  useEffect(() => {
    const fetchRepairEntries = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return; // Ако няма влязъл потребител, не зареждай данни

      // Извършваме заявка, която филтрира по uid на текущия потребител
      const querySnapshot = await getDocs(
        query(collection(db, "repairRecords"), where("uid", "==", user.uid))
      );

      const entries: repairEntry[] = [];
      querySnapshot.forEach((doc) => {
        entries.push({ ...doc.data(), id: doc.id } as repairEntry);
      });

      // Сортираме по дата (най-старите първи)
      const sortedEntries = entries.sort((a: repairEntry, b: repairEntry) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      setRepairEntries(sortedEntries);
    };

    fetchRepairEntries();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth(); // Вземаме текущия потребител
    const user = auth.currentUser;

    if (!user) {
      console.error("Няма влязъл потребител.");
      return;
    }

    if (!parts || !labour || !totalPrice || !serviceName || !mileage || !date) {
      setErrorMessage("Моля, попълнете всички полета!");
      return;
    }

    const newrepairEntry: repairEntry = {
      totalPrice,
      serviceName,
      parts,
      labour,
      mileage,
      date,
      comment,
    };

    try {
      // Добавяме UID на потребителя
      await addDoc(collection(db, "repairRecords"), {
        ...newrepairEntry,
        uid: user.uid, // Добавяме UID на потребителя
      });
      setRepairEntries([newrepairEntry, ...repairEntries]);
      setErrorMessage("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // Reset the form fields
    setParts("");
    setLabour("");
    setTotalPrice("");
    setServiceName("Бензин");
    setMileage("");
    setDate("");
    setComment("");
    setIsModalVisible(false); // Скриваме модала след като добавим данни
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
    setIsModalVisible(!isModalVisible); // Променяме видимостта на модала
  };

  return (
    <div className="fuel-container">
      <Navigation />
      <h1>Добави Ремонт</h1>

      <button onClick={toggleModalVisibility} className="add-fuel-button">
        {isModalVisible ? "Затвори формата" : "Добави нов ремонт"}
      </button>

      {isModalVisible && (
        <div className={`modal-overlay ${isModalVisible ? "show" : ""}`}>
          {" "}
          {/* Задният замъглен фон */}
          <div className={`modal-container ${isModalVisible ? "show" : ""}`}>
            {" "}
            {/* Модалният прозорец с формата */}
            <button onClick={toggleModalVisibility} className="close-button">
              X
            </button>{" "}
            {/* Бутон за затваряне */}
            <form onSubmit={handleFormSubmit}>
              {errorMessage && (
                <div className="error-message" id="error-message">
                  {errorMessage}
                </div>
              )}
              <label>Тип услуга:</label>
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              >
                <option value="periodicalMaintenance">
                  Периодична подръжка
                </option>
                <option value="Смяна на гуми">Смяна на гуми</option>
                <option value="Смяна на масло и филтри">
                  Смяна на масло и филтри
                </option>
                <option value="Смяна на въздушен филтър">
                  Смяна на въздушен филтър
                </option>
                <option value="Смяна на климатичен филтър">
                  Смяна на климатичен филтър
                </option>
                <option value="Смяна на накладки">Смяна на накладки</option>
                <option value="Смяна на дискове и накладки">
                  Смяна на дискове и накладки
                </option>
                <option value="Смяна на спирачна течност">
                  Смяна на спирачна течност
                </option>
                <option value="Смяна на свещи">Смяна на свещи</option>
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

              <label>Цена за части:</label>
              <input
                type="number"
                value={parts}
                onChange={(e) => setParts(e.target.value)}
                placeholder="Цена за части"
              />

              <label>Цена за труд:</label>
              <input
                type="number"
                value={labour}
                onChange={(e) => setLabour(e.target.value)}
                placeholder="Цена за труд"
              />
              <label>Обща платена цена:</label>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="Обща цена"
              />

              <label>Коментар:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Добави коментар (не е задължително)"
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
              <th>Тип услуга</th>
              <th>Километраж</th>
              <th>Дата и час</th>
              <th>Цена за части</th>
              <th>Цена за труд</th>
              <th>Обща цена</th>
              <th>Коментар</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {repairEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.serviceName}</td>
                <td>{entry.mileage}</td>
                <td>{entry.date}</td>
                <td>{entry.parts}</td>
                <td>{entry.labour}</td>
                <td>{entry.totalPrice}</td>
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

export default FuelPage;
