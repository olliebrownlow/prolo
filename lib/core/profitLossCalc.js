export const getProlo = (appCurrencyName, investmentItems, balance) => {
  const propertyName = _.camelCase(appCurrencyName);
  const valuesArray = [];
  investmentItems.map((investment) => {
    const positiveValue = parseFloat(investment[propertyName]);
    if (investment.type === "withdrawal") {
      const negativeValue = positiveValue * -1;
      valuesArray.push(negativeValue);
    } else {
      valuesArray.push(positiveValue);
    }
  });
  // reduce causes error when array is empty
  if (valuesArray.length) {
    const unroundedInvestmentValue = valuesArray.reduce(
      (accumulator, current) => accumulator + current
    );
    return balance - unroundedInvestmentValue;
  } else {
    return balance;
  }
};
