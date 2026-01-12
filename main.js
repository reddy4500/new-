
import { normalizeAuditData, detectLossAlerts } from '../core/financeEngine.js';
import { renderProfitChart } from '../charts/charts.js';

const dummyAudit = {};
const dummyDiesel = {};

const fleet = normalizeAuditData(dummyAudit, dummyDiesel);
const labels = Object.keys(fleet);
const profits = labels.map(b =>
  Object.values(fleet[b]).reduce((s,m)=>s+m.profit,0)
);

renderProfitChart(
  document.getElementById('profitChart'),
  labels,
  profits
);
