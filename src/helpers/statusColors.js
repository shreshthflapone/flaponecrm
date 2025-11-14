const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "Booked":
      return "#1bc943";
    case "Advance Received":
      return " #039925";
    case "Full Payment Received":
      return "#08bf32";
    case "Junk":
      return "#f83245";
    case "New":
      return "#5383ff";
    case "Followup":
      return "#fab206";
    case "Untouched":
      return "#759bff";
    case "No Response ":
      return "#f4772e";
    case "Hot":
      return "#f4772e";
    default:
      return "#5383ff";
  }
};

export { getStatusBackgroundColor };
