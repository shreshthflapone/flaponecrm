export const formatAmount = (amount) => {
    if (isNaN(amount)) return "Invalid Amount";
  
    return new Intl.NumberFormat("hi-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };
  