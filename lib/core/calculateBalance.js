export const calculateBalance = async (coinData, fiatData) => {
  const emptyArrayIfNeeded = () => {
    if (coinData[0].total) {
      return coinData;
    } else {
      return [];
    }
  };

  const calculateUnroundedBalance = (array) => {
    const unrounded =
      array.reduce(function (prev, next) {
        return prev + next.total;
      }, 0) +
      fiatData.reduce(function (prev, next) {
        return prev + next.value;
      }, 0);

    return unrounded;
  };

  const unroundedBalance = calculateUnroundedBalance(emptyArrayIfNeeded());
  
  return unroundedBalance;
};
