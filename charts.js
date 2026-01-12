
export function renderProfitChart(ctx, labels, profits) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Net Profit', data: profits }]
    }
  });
}
