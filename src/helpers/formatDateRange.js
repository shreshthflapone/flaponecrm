const formatDateRange = (inputDate) => {
    const [day, monthStr, yearStr] = inputDate.split(/[\s,]+/);    
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
  
    const month = monthMap[monthStr];
    const year = `${yearStr}`;
  
    const formattedDate = `${day.padStart(2, "0")}-${month}-${year}`;
    return `${formattedDate} | ${formattedDate}`;
  };
  
  export default formatDateRange
  