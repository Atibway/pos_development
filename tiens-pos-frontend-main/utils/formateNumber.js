const formatNumber = (value) => {
  return parseFloat(value.toString()).toString();
};

export default formatNumber;


export const formatCurrency = (amount, currency = "UGX") => {
  if (isNaN(amount)) return "0";

  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

