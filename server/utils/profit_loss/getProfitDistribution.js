import {calculatePercentage, calculateProfitDistribution, round3Precision} from "#utils/common/calculations";

export default function getProfitDistribution(bots, currency = undefined) {
  const profitDistribution = calculateProfitDistribution(bots);
  const profitDistributionData = [];

  if (currency) {
    profitDistributionData.push({
      x: currency,
      y: [0, round3Precision(profitDistribution[`${currency}_PROFIT`])]
    })
  } else {
    profitDistributionData.push({
      x: 'BTC',
      y: [0, round3Precision(profitDistribution['BTC_PROFIT'])]
    });
    profitDistributionData.push({
      x: 'ETH',
      y: [0, round3Precision(profitDistribution['ETH_PROFIT'])]
    });
  }

  const assetAllocationData = {
    series: [round3Precision(profitDistribution['ETH']), round3Precision(profitDistribution['BTC'])], // ETH - BTC
    eth: calculatePercentage(profitDistribution['ETH'], profitDistribution['investment']),
    btc: calculatePercentage(profitDistribution['BTC'], profitDistribution['investment']),
  }

  return {profitDistributionData, assetAllocationData};
};
