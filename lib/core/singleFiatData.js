import { getConvertedAmount, getFiat } from "../../actions";

export const getSingleFiatData = async (
  targetFiatCode,
  userNumber,
  portfolioNumber,
  currencyCode
) => {
  const fiatCurrency = await getFiat({
    code: targetFiatCode,
    userNumber: userNumber,
    portfolioNumber: portfolioNumber,
  });
  const fiatConvert = currencyCode.toUpperCase();

  const fiatDataFull = await getConvertedAmount(
    fiatCurrency.code,
    fiatConvert,
    fiatCurrency.amount
  );

  const singleFiatData = [fiatDataFull].map((convertedBalance) => ({
    id: convertedBalance.response.from,
    from: convertedBalance.response.from,
    to: convertedBalance.response.to,
    amount: convertedBalance.response.amount,
    value: convertedBalance.response.value,
    fullFiatName: fiatCurrency.name,
    fiatSign: fiatCurrency.sign,
  }));

  return singleFiatData[0];
};
