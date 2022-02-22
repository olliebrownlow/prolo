import {
  getConvertedAmount,
  getFiat,
  getCurrencyAndTheme,
} from "../../actions";

export const getSingleFiatData = async (targetFiatCode, user) => {
  const fiatCurrency = await getFiat({ code: targetFiatCode, user: user });
  const currencySettings = await getCurrencyAndTheme(user);
  const fiatConvert = currencySettings.currencyCode.toUpperCase();

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
