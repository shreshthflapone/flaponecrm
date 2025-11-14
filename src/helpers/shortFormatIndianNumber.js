export const shortFormatIndianNumber = (amount) => {
    if (isNaN(amount)) return "Invalid Amount";
  
    let formattedNumber = "";
  
    if (amount >= 10000000) {
      formattedNumber = "₹" + (amount / 10000000).toFixed(2) + " C"; // Crores
    } else if (amount >= 100000) {
      formattedNumber = "₹" + (amount / 100000).toFixed(2) + " L"; // Lakhs
    } else if (amount >= 1000) {
      formattedNumber = "₹" + (amount / 1000).toFixed(2) + " K"; // Thousands
    } else {
      formattedNumber = "₹" + amount.toFixed(2); // Below Thousand
    }
  
    return formattedNumber;
  };
  