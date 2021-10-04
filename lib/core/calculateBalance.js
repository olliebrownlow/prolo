import { updateBalance } from "../../actions";

export const calculateBalance = async (
  coinData,
  fiatData,
  settingsCurrencySign
) => {
  const emptyArrayIfNeeded = () => {
    if (coinData[0].total) {
      return coinData;
    } else {
      return [];
    }
  };

  const calculateAndSetBalance = (array) => {
    const unrounded =
      array.reduce(function (prev, next) {
        return prev + next.total;
      }, 0) +
      fiatData.reduce(function (prev, next) {
        return prev + next.value;
      }, 0);

    return unrounded;
  };

  let unroundedBalance;
  const handleUpdateBalance = async () => {
    unroundedBalance = calculateAndSetBalance(emptyArrayIfNeeded());

    const res = await updateBalance([
      {
        code: coinData[0].currencyInUse,
        amount: unroundedBalance,
        sign: settingsCurrencySign,
      },
    ]);
    console.log(res);
  };
  handleUpdateBalance();
  // console.log("here: " + unroundedBalance + " :here");

  return unroundedBalance;
};
