export const colors = {
  primary: "#005D80",
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
