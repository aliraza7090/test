import {RISKS} from "#constants/index";
import {Profit} from "#models/profit.model";

const _RISK = {7: RISKS[0], 15: RISKS[1], 30: RISKS[2]};

export default async function profitLoss(days = 7, filter = {}) {
  const risk = _RISK[days];
  const $match = {...filter, risk}
  const $group = {
    _id: "$created_at",
    profit: {$sum: {$cond: [{'$gt': ['$value', 0]}, "$value", 0]}},
    loss:{$sum:{$cond:[{ '$lt': ['$price', 0]}, "$price", 0]}},
  }

  return Profit.aggregate([
    {$match},
    {$group},
  ])
}
