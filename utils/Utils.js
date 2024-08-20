export const colors = {
  primary: "#248277",
  secondary: "#2D2D2D",
  background: "#FFFFFF",
  text: "#000000",
};

export const removeSpaces = (str) => {
  return str.replace(/\s+/g, "");
};

export const transformDateToISO = (date) => {
  // Ensure the input is a Date object
  const d = new Date(date);

  // Get the year, month, and day
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(d.getDate()).padStart(2, "0");

  // Return the formatted date
  return `${year}-${month}-${day}`;
};

export const dateFormatting = (str) => {
  const [year, month, day] = str.split('-');
  return `${day}/${month}/${year}`;
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

export const formatCin = (number) => {
  const cleaned = number.replace(/\D/g, "");
  const pattern = /(\d{3})(\d{3})(\d{3})(\d{3})/;
  return cleaned.replace(pattern, "$1 $2 $3 $4");
};



export const capitalizeFirstLetter = (str) => {
  if (!str) return ''; // Return an empty string if the input is null or undefined
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const makeUpperCase = (str) => {
  if (!str) return ''; // Return an empty string if the input is null or undefined
  return str.toUpperCase();
};