import {RISKS} from "#constants/index";
import {Profit} from "#models/profit.model";

const _RISK = {7: RISKS[0], 15: RISKS[1], 30: RISKS[2]};

export default async function dailyProfitChartAggregate(days = 7, filter = {}) {
  const risk = _RISK[days];


  const $match = {...filter, risk};
  const result = await Profit.aggregate([
    {$match},
    {
      $project: {
        createdAt: "$created_at",
        profit: "$value"
      }
    },
    {
      $group: {
        _id: { $dayOfYear: "$createdAt"},
        profit: {$sum: "$profit"},
        dates: {$push: "$createdAt"},
      }
    },
    {$addFields: {startDate: {$min: "$dates"}}},
    {$sort: {_id: 1}},
    {
      $project: {
        _id: false,
        profit: "$profit",
        startDate: {$toLong: "$startDate"},
        data: [{$toLong: "$startDate"}, {$round: ["$profit", 3]}]
      }
    }
  ]);

  return result?.map(record => ([...record['data']]))
}
