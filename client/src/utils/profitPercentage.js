import _ from "lodash";

const profitPercentage = (profit = 0,loss = 0,investment = 1) => _.round((profit + loss) * 100 / investment, 4)


export default profitPercentage