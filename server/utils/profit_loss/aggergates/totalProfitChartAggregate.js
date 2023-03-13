import {Profit} from "#models/profit.model";
import {RISKS} from "#constants/index";

const _RISK = {7: RISKS[0], 15: RISKS[1], 30: RISKS[2]};

export default async function totalProfitChartAggregate(days = 7, filters = {}) {
  const risk = _RISK[days];

  // const format = days === 30 ? "%m/%Y" : "%m/%d/%Y";
  const $match = {...filters, risk};
  // const $group = {_id: "$created_at",profit: {$sum: "$value"}, dates: {$push: "$created_at"}}
  const $group = {_id:  { $dayOfYear: "$created_at"},profit: {$sum: "$value"}, dates: {$push: "$created_at"}}
  const $sort = {startDate: 1}


  // if (days === 7) $group['_id'] = {week: {$week: "$created_at"}}
  /*if (days === 7) $group['_id'] = {week: "$created_at"}
  else if (days === 15) $group['_id'] = {
    $subtract: [{$subtract: ["$date", new Date()]}, {$mod: [{$subtract: ["$date", new Date()]}, 1000 * 60 * 60 * 24 * 15]}]
  }
  else $group['_id'] = {month: {$month: "$created_at"}}*/

  const result = await Profit.aggregate([{$match}, {$group}, {$addFields: {startDate: {$min: "$dates"}}}, {
    $project: {
      _id: false,
      profit: "$profit",
      startDate: {$toLong: "$startDate"},
      data: [{$toLong: "$startDate"}, {$round: ["$profit", 3]}]
    }
  },
    {$sort}
  ])

  return result?.map(record => ([...record['data']]))
};
