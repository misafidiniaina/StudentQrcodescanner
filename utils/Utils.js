export const colors = {
  primary: "#248277",
  secondary: "#2D2D2D",
  background: "#FFFFFF",
  text: "#000000",
};

export const removeSpaces = (str) => {
  return str.replace(/\s+/g, "");
};

export const transformDateToISO = (dateStr) => {
  return dateStr.toISOString();
};

const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const printableDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};


export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const pattern = /(\d{3})(\d{2})(\d{3})(\d{2})/;
  return cleaned.replace(pattern, "$1 $2 $3 $4");
};


// formatNumber.js
export const formatCin = (number) => {
  const cleaned = number.replace(/\D/g, "");
  const pattern = /(\d{3})(\d{3})(\d{3})(\d{3})/;
  return cleaned.replace(pattern, "$1 $2 $3 $4");
};
