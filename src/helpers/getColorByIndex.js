function getColorByIndex(index) {
    const colors = [
      "#b5cff7",
      "#e39e97",
      "#91ffc1",
      "#6c9ced",
      "#98d8e6",
      "#f8d777",
      "#9ff877",
      "#77f8e3",
      "#77aef8",
      "#fdf26f",
      "#fdf26f", 
    ];
    return colors[index] || "#fdf26f";
  }
  
  export { getColorByIndex };
  