import _ from "lodash"
import moment from "moment"
import {Profit} from "#models/profit.model";

export default async function todayProfit(filters = {}) {
  const today = moment().startOf('day').toDate();
  const $match = {...filters, created_at: {$gte: today}}

  const result = await Profit.aggregate([
    {$match},
    {
      $project: {
        createdAt: {$dateToString: {format: "%m/%d/%Y", date: "$created_at"}},
        profit: "$value"
      }
    },
    {
      $group: {
        _id: "$createdAt",
        profit: {$sum: "$profit"}
      }
    },
    {$project: {_id: false}}
  ]);
  const value = result?.[0]?.profit || 0;
  return _.round(value, 3)
};
