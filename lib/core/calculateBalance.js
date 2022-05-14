export const calculateBalance = (coinData, fiatData) => {
  const emptyArrayIfNeeded = () => {
    if (coinData[0].id) {
      return coinData;
    } else {
      return [];
    }
  };

  const calculateUnroundedBalances = (array) => {
    const unroundedCoin = array.reduce(function (prev, next) {
      return prev + next.total;
    }, 0);

    const unroundedFiat = fiatData.reduce(function (prev, next) {
      return prev + next.value;
    }, 0);

    return {
      balance: unroundedCoin + unroundedFiat,
      coinTotal: unroundedCoin,
      fiatTotal: unroundedFiat,
    };
  };

  const unroundedBalances = calculateUnroundedBalances(emptyArrayIfNeeded());

  if (coinData[0].portfolioNumber) {
    unroundedBalances.portfolioNumber = coinData[0].portfolioNumber;
    return unroundedBalances;
  } else {
    return unroundedBalances;
  }
};
