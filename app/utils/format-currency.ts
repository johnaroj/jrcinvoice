interface FormatCurrencyProps {
  amount: number;
  currency: "USD" | "EUR";
}

export const formatCurrency = ({ amount, currency }: FormatCurrencyProps) => {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "nl-NL", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
