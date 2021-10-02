import {
  getConvertedAmount,
  getCurrencySettings,
  getFiat,
} from "../../actions";

export const getConvertedBalanceData = async () => {
  const fiatData = await getFiat();

  const currencySettings = await getCurrencySettings();
  const fiatConvert = currencySettings[0].currencyCode.toUpperCase();

  let convertedBalanceDataFull = [];
  await Promise.all(
    fiatData.map(async (item) => {
      convertedBalanceDataFull.push(
        await getConvertedAmount(item.code, fiatConvert, item.amount)
      );
    })
  );

  const fullFiatName = (fiatCode) => {
    let result = "unknown currency";
    fiatData.filter((fiat) => {
      if (fiat.code === fiatCode) {
        result = fiat.name;
      }
    });
    return result;
  };

  const fiatSign = (fiatCode) => {
    let result = "";
    fiatData.filter((fiat) => {
      if (fiat.code === fiatCode) {
        result = fiat.sign;
      }
    });
    return result;
  };

  const convertedBalanceData = convertedBalanceDataFull.map(
    (convertedBalance) => ({
      id: convertedBalance.response.from,
      from: convertedBalance.response.from,
      to: convertedBalance.response.to,
      amount: convertedBalance.response.amount,
      value: convertedBalance.response.value,
      fullFiatName: fullFiatName(convertedBalance.response.from),
      fiatSign: fiatSign(convertedBalance.response.from),
    })
  );

  return convertedBalanceData;
};
