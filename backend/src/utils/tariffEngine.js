const db = require('../db/connection');

function calculateTariff(weightKg, distanceKm, category = 'General Goods') {
  const tariff = db.prepare('SELECT * FROM tariffs WHERE is_active = 1 LIMIT 1').get() || {
    base_rate: 450,
    rate_per_km: 10,
    rate_per_kg: 2.5,
    fragile_multiplier: 1.25,
    hazardous_multiplier: 1.5,
    perishable_multiplier: 1.35,
    tax_percentage: 18.0
  };

  const weight = Math.max(0, parseFloat(weightKg) || 0);
  const distance = Math.max(0, parseFloat(distanceKm) || 0);

  const charge_base = Math.round(tariff.base_rate * 100) / 100;
  const charge_weight = Math.round(weight * tariff.rate_per_kg * 100) / 100;
  const charge_distance = Math.round(distance * tariff.rate_per_km * 100) / 100;

  const baseSum = charge_base + charge_weight + charge_distance;
  let charge_category = 0;

  if (category === 'Fragile') {
    charge_category = Math.round(baseSum * (tariff.fragile_multiplier - 1) * 100) / 100;
  } else if (category === 'Hazardous') {
    charge_category = Math.round(baseSum * (tariff.hazardous_multiplier - 1) * 100) / 100;
  } else if (category === 'Perishable') {
    charge_category = Math.round(baseSum * (tariff.perishable_multiplier - 1) * 100) / 100;
  }

  const subtotal = Math.round((baseSum + charge_category) * 100) / 100;
  const charge_tax = Math.round((subtotal * (tariff.tax_percentage / 100)) * 100) / 100;
  const charge_total = Math.round((subtotal + charge_tax) * 100) / 100;

  return {
    tariff_name: tariff.name,
    weight_kg: weight,
    distance_km: distance,
    goods_category: category,
    charge_base,
    charge_weight,
    charge_distance,
    charge_category,
    subtotal,
    tax_percentage: tariff.tax_percentage,
    charge_tax,
    charge_total
  };
}

module.exports = { calculateTariff };
