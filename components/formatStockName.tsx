const formatStockName = (itemName: string) => {
  switch (itemName) {
    case "S":
      return "Small";
    case "M":
      return "Medium";
    case "L":
      return "Large";
    case "MIX":
      return "Mix Pack";
    case "single":
      return "Single";
    case "double":
      return "Double";
    default:
      return itemName.replace(/_/g, " ");
  }
};

export default formatStockName;
