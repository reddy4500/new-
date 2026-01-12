
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function normalizeAuditData(audit, diesel) {
  const fleet = {};
  MONTHS.forEach(m => {
    const rows = audit[m] ? Object.values(audit[m]) : [];
    rows.forEach(r => {
      if (!r.busNumber) return;
      const b = r.busNumber.toUpperCase();
      if (!fleet[b]) fleet[b] = {};
      const dieselCost = diesel?.[m]?.[b] || 0;
      const revenue = +r.revenue || 0;
      const expense = (+r.expense || 0) + dieselCost;
      fleet[b][m] = {
        revenue,
        expense,
        diesel: dieselCost,
        profit: revenue - expense,
        margin: revenue ? ((revenue-expense)/revenue)*100 : 0
      };
    });
  });
  return fleet;
}

export function detectLossAlerts(busData) {
  let count = 0;
  for (const m of MONTHS) {
    if (!busData[m]) continue;
    if (busData[m].profit < 0) count++;
    else count = 0;
    if (count >= 3) return true;
  }
  return false;
}
