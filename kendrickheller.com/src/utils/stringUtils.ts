export const normalizationZipcode = (zipcode: string) => {
  if (!zipcode) return zipcode;
  const normalizationZipcode = zipcode.replaceAll(new RegExp('[\\D]', 'g'), '');
  return normalizationZipcode;
};

export const number2money = (
  money: number | string | undefined,
  locales = 'en-US',
  currency = 'USD',
) => {
  if (money == undefined) return '';
  const numMoney = Number(money);
  if (isNaN(numMoney)) return money.toString();
  return numMoney.toLocaleString(locales, { style: 'currency', currency: currency });
};


export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}