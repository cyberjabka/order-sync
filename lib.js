const SOURCE = process.env.SOURCE_URL || "https://test.ooobs.ru/api/orders";

function normalizePhone(raw) {
  const d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 11 && (d[0] === "7" || d[0] === "8")) return "+7" + d.slice(1);
  if (d.length === 10) return "+7" + d;
  return null;
}

function sync(orders) {
  const byPhone = new Map();
  let invalid = 0;
  for (const o of orders) {
    const phone = normalizePhone(o.phone);
    if (!phone) { invalid++; continue; }
    const rec = {
      name: o.name ?? "",
      phone,
      email: o.email ?? "",
      amount: Number(o.amount) || 0,
      _t: Date.parse(o.created_at) || 0,
    };
    const prev = byPhone.get(phone);
    if (!prev || rec.amount > prev.amount || (rec.amount === prev.amount && rec._t > prev._t)) {
      byPhone.set(phone, rec);
    }
  }
  const clients = [...byPhone.values()].map(({ _t, ...c }) => c);
  const valid = orders.length - invalid;
  return {
    clients,
    stats: {
      received: orders.length,
      unique: clients.length,
      duplicates_merged: valid - clients.length,
      invalid_dropped: invalid,
    },
  };
}

let lastGood = null;
async function getResult() {
  try {
    const r = await fetch(SOURCE, { headers: { accept: "application/json" } });
    if (!r.ok) throw new Error("upstream " + r.status);
    const data = await r.json();
    lastGood = sync(Array.isArray(data) ? data : []);
  } catch (e) {
    if (!lastGood) throw e;
  }
  return lastGood;
}

module.exports = { normalizePhone, sync, getResult };
