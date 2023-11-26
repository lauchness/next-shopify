const formatCurrency = (amount: number = 0, currencyCode: string = "USD") => {
  return Number(amount).toLocaleString("en-US", {
    currency: currencyCode,
    style: "currency",
  });
};

export default formatCurrency;
