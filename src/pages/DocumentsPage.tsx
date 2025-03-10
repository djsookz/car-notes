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

interface documentEntry {
  id?: string;
  documentName: string;
  mileage: string;
  date: string;
  totalPrice: string;
  comment: string;
}

const DocumentsPage = () => {
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [documentName, setDocumentName] = useState<string>("Глоба");
  const [mileage, setMileage] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [documentEntries, setDocumentEntries] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { highestMileage, allEntries, refreshData } = useMileage();

  useEffect(() => {
    const fetchDocumentEntries = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const querySnapshot = await getDocs(
        query(collection(db, "documentRecords"), where("uid", "==", user.uid))
      );

      const entries: documentEntry[] = [];
      querySnapshot.forEach((doc) => {
        entries.push({ ...doc.data(), id: doc.id } as documentEntry);
      });

      const sortedEntries = entries.sort(
        (a: documentEntry, b: documentEntry) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
      );
      setDocumentEntries(sortedEntries);
    };

    fetchDocumentEntries();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!totalPrice || !documentName || !mileage || !date) {
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
  
    const newDocumentEntry: documentEntry = {
      totalPrice,
      documentName,
      mileage,
      date,
      comment,
    };
  
    try {
      await addDoc(collection(db, "documentRecords"), {
        ...newDocumentEntry,
        uid: user.uid,
      });
      
      await refreshData();
      setDocumentEntries([newDocumentEntry, ...documentEntries]);
      setErrorMessage("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  
    setTotalPrice("");
    setDocumentName("Глоба");
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
      await deleteDoc(doc(collection(db, "documentRecords"), id));
      setDocumentEntries(documentEntries.filter((entry) => entry.id !== id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleDeleteAllEntries = async () => {
    for (const entry of documentEntries) {
      if (!entry.id) continue;
      await deleteDoc(doc(db, "documentRecords", entry.id));
    }
    setDocumentEntries([]);
  };

  const toggleModalVisibility = () => {
    setIsModalVisible(!isModalVisible); // Променяме видимостта на модала
  };

  return (
    <div className="fuel-container">
      <Navigation />
      <div>
        <h1>Документи</h1>
        <p>
          Тук можеш да добавиш информация за глоби, застраховки, такси и други
          документи, които да запишеш и управляваш.
        </p>
      </div>
      <button onClick={toggleModalVisibility} className="add-document-button">
        {isModalVisible ? "Затвори формата" : "Добави нов документ"}
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
              <label>Име на документ:</label>
              <select
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              >
                <option value="Глоби">Глоба</option>
                <option value="Застраховка">Застраховка</option>
                <option value="Такси">Такса</option>
                <option value="Други Документи">Други Документи</option>
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
              <th>Име на документ</th>
              <th>Километраж</th>
              <th>Дата</th>
              <th>Обща цена</th>
              <th>Коментар</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {documentEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.documentName}</td>
                <td>{entry.mileage}</td>
                <td>{entry.date}</td>
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
          {documentEntries.length > 0 && (
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

export default DocumentsPage;