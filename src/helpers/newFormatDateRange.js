const newFormatDateRange = (dateRange) => {
    const [start, end] = dateRange.split(" | ").map((date) => {
      const [day, month, year] = date
        .split("-")
        .map((part) => parseInt(part, 10));
      return new Date(year, month - 1, day);
    });

    const startDate = new Date(start.setHours(18, 30, 0, 0)).toISOString();
    const endDate = new Date(end.setHours(18, 29, 59, 999)).toISOString();

    return [
      {
        startDate,
        endDate,
        key: "selection",
      },
    ];
  };

  export default newFormatDateRange
