export const formattedNumber = (balance?: string, decimalPlaces = 4) => {
  const result = Number(parseFloat(balance || "0").toFixed(4));

  return result.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};
