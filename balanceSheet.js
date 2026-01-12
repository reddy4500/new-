
export function generateBalanceSheet(busData) {
  let income = 0, expense = 0;
  Object.values(busData).forEach(m => {
    income += m.revenue;
    expense += m.expense;
  });
  return {
    income,
    expense,
    net: income - expense
  };
}
