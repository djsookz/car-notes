import { getDocs, query, collection, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { getAuth } from "firebase/auth";

// Тип за записите в базата
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

// Функция за извличане на всички километри от Firebase
export const getMileageRecords = async (): Promise<FuelEntry[]> => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return [];

    const querySnapshot = await getDocs(
        query(
            collection(db, "fuelRecords"),
            where("uid", "==", user.uid),
            orderBy("date", "asc") // Важно! Сортиране по дата
        )
    );

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as FuelEntry)
    }));
};

// Функция за проверка на валидността на километража
export const isValidMileage = (mileage: number, date: string, records: FuelEntry[]): boolean => {
    // Превръщаме датите в числа за сравнение
    const newDate = new Date(date).getTime();

    for (const record of records) {
        const recordDate = new Date(record.date).getTime();
        const recordMileage = parseFloat(record.mileage);

        // Ако новата дата е по-ранна, но пробегът е по-висок → грешка
        if (newDate < recordDate && mileage > recordMileage) {
            return false;
        }
    }

    return true;
};
