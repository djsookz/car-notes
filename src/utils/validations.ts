export const validateMileage = (
    inputMileage: number,
    inputDate: Date,
    allEntries: any[],
    currentDate: Date
  ): string | null => {
    if (inputDate > currentDate) {
      return "Не може да се добавят стойности в бъдещето!";
    }
  
    const maxFutureMileage = allEntries
      .filter((entry) => new Date(entry.date) >= inputDate)
      .reduce((max, entry) => Math.max(max, parseFloat(entry.mileage)), 0);
  
    if (inputDate >= currentDate && inputMileage < maxFutureMileage) {
      return "Не можете да добавите по-малък километраж за тази дата или по-късно!";
    }
  
    const maxPastMileage = allEntries
      .filter((entry) => new Date(entry.date) <= inputDate)
      .reduce((max, entry) => Math.max(max, parseFloat(entry.mileage)), 0);
  
    if (inputDate < currentDate && inputMileage < maxPastMileage) {
      return "Не можете да добавите по-малък километраж за по-нова дата!";
    }
  
    return null;
  };