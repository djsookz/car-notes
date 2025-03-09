    import React, { useState, useEffect } from 'react';
    import Navigation from "../components/Navigation";
    import './FuelPage.css';
    import { db, collection, addDoc, getDocs, deleteDoc, doc } from '../firebase/config';

    interface FuelEntry {
        id?: string;
    totalPrice: string;
    fuelType: string;
    pricePerLiter: string;
    liters: string;
    mileage: string;
    date: string;
    comment: string;
    }

    const FuelPage = () => {
    const [pricePerLiter, setPricePerLiter] = useState<string>('');
    const [liters, setLiters] = useState<string>('');
    const [totalPrice, setTotalPrice] = useState<string>('');
    const [fuelType, setFuelType] = useState<string>('benzine');
    const [mileage, setMileage] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [comment, setComment] = useState<string>(''); 
    const [errorMessage, setErrorMessage] = useState<string>(''); 

    const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);

    const calculateTotalPrice = (price: number, liters: number) => {
        return (price * liters).toFixed(2);
    };

    useEffect(() => {
        if (pricePerLiter && liters) {
        const price = parseFloat(pricePerLiter) || 0;
        const liter = parseFloat(liters) || 0;
        setTotalPrice(calculateTotalPrice(price, liter));
        }
    }, [pricePerLiter, liters]);

    // Зареждаме данни от Firebase
    useEffect(() => {
        const fetchFuelEntries = async () => {
        const querySnapshot = await getDocs(collection(db, "fuelRecords"));
        const entries: FuelEntry[] = [];
        querySnapshot.forEach((doc) => {
            entries.push({ ...doc.data(), id: doc.id } as FuelEntry);
        });
        // Сортираме по дата (най-старите първи)
        const sortedEntries = entries.sort((a: FuelEntry, b: FuelEntry) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setFuelEntries(sortedEntries);
        };

        fetchFuelEntries();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
        !pricePerLiter || 
        !liters || 
        !totalPrice || 
        !fuelType || 
        !mileage || 
        !date
        ) {
        setErrorMessage('Моля, попълнете всички полета!');
        return;
        }

        const newFuelEntry: FuelEntry = {
        totalPrice,
        fuelType,
        pricePerLiter,
        liters,
        mileage,
        date,
        comment
        };

        try {
        await addDoc(collection(db, "fuelRecords"), newFuelEntry);
        setFuelEntries([newFuelEntry, ...fuelEntries]); // Добавяме записа в началото
        setErrorMessage('');
        } catch (e) {
        console.error("Error adding document: ", e);
        }

        setPricePerLiter('');
        setLiters('');
        setTotalPrice('');
        setFuelType('benzine');
        setMileage('');
        setDate('');
        setComment('');
    };

    const handleDeleteEntry = async (id?: string) => {
        if (!id) {
            console.error("Опит за изтриване на запис без ID");
            return;
          }
        try {
        await deleteDoc(doc(collection(db, "fuelRecords", id)));
        setFuelEntries(fuelEntries.filter(entry => entry.id !== id));
        } catch (e) {
        console.error("Error deleting document: ", e);
        }
    };

    const handleDeleteAllEntries = async () => {
        for (const entry of fuelEntries) {
            if (!entry.id) continue;
        await deleteDoc(doc(db, "fuelRecords", entry.id));
        }
        setFuelEntries([]);
    };

    return (
        <div className="fuel-container">
        <Navigation />
        <h1>Добави гориво</h1>
        <div className="form-container">
            <form onSubmit={handleFormSubmit}>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            
            <label>Обща платена цена:</label>
            <input 
                type="number" 
                value={totalPrice} 
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="Обща цена" 
            />

            <label>Тип гориво:</label>
            <select 
                value={fuelType} 
                onChange={(e) => setFuelType(e.target.value)}
            >
                <option value="benzine">Бензин</option>
                <option value="diesel">Дизел</option>
                <option value="gas">Газ</option>
            </select>

            <label>Цена на литър:</label>
            <input 
                type="number" 
                value={pricePerLiter}
                onChange={(e) => setPricePerLiter(e.target.value)}
                placeholder="Цена на литър"
            />

            <label>Литри гориво:</label>
            <input 
                type="number" 
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                placeholder="Литри гориво"
            />

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

            <label>Коментар:</label>
            <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="Добави коментар (не е задължително)"
            />

            <button type="submit">Запази</button>
            </form>
        </div>

        {fuelEntries.length > 0 && (
            <button onClick={handleDeleteAllEntries} className="delete-all-button">
            Изтрий всички записи
            </button>
        )}

        <div className="fuel-table-container">
            <h2>Добавени записи:</h2>
            <table>
            <thead>
                <tr>
                <th>Обща цена</th>
                <th>Тип гориво</th>
                <th>Цена на литър</th>
                <th>Литри гориво</th>
                <th>Километраж</th>
                <th>Дата и час</th>
                <th>Коментар</th>
                <th>Действие</th>
                </tr>
            </thead>
            <tbody>
                {fuelEntries.map((entry) => (
                <tr key={entry.id}>
                    <td>{entry.totalPrice}</td>
                    <td>{entry.fuelType}</td>
                    <td>{entry.pricePerLiter}</td>
                    <td>{entry.liters}</td>
                    <td>{entry.mileage}</td>
                    <td>{entry.date}</td>
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
        </div>
        </div>
    );
    };

    export default FuelPage;
