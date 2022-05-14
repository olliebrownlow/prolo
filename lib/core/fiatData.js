import { getConvertedAmount, getFiats } from "../../actions";

export const getFiatData = async (
  userNumber,
  portfolioNumber,
  currencyCode
) => {
  const fiatMonies = await getFiats({
    userNumber: userNumber,
    portfolioNumber: portfolioNumber,
  });
  const fiatConvert = currencyCode.toUpperCase();

  let fiatDataFull = [];
  await Promise.all(
    fiatMonies.map(async (item) => {
      fiatDataFull.push(
        await getConvertedAmount(item.code, fiatConvert, item.amount)
      );
    })
  );

  const fullFiatName = (fiatCode) => {
    let result = "unknown currency";
    fiatMonies.filter((fiat) => {
      if (fiat.code === fiatCode) {
        result = fiat.name;
      }
    });
    return result;
  };

  const fiatSign = (fiatCode) => {
    let result = "";
    fiatMonies.filter((fiat) => {
      if (fiat.code === fiatCode) {
        result = fiat.sign;
      }
    });
    return result;
  };

  const fiatData = fiatDataFull.map((convertedBalance) => ({
    id: convertedBalance.response.from,
    from: convertedBalance.response.from,
    to: convertedBalance.response.to,
    amount: convertedBalance.response.amount,
    value: convertedBalance.response.value,
    fullFiatName: fullFiatName(convertedBalance.response.from),
    fiatSign: fiatSign(convertedBalance.response.from),
    portfolioNumber: portfolioNumber,
  }));

  return fiatData;
};
