export const number2money = (money: number | undefined) => {
  if(money == undefined) return "";
  return money.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'});
};

// export const money2number = (str: string) => {
//   str = str.replace(new RegExp("[^0-9\\.]+"),"");
//   if(!str) return undefined;
//   var number = Number(str);
//   return number;
// };

export const numberFormat = (money: number | undefined) => {
  if(money == undefined) return "";
  return money.toLocaleString('vi-VN');
};