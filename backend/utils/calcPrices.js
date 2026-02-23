import dotenv from "dotenv";

dotenv.config();

function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

const TAX = process.env.VAT / 100;

export function calcPrices(orderItems) {
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const shippingPrice = addDecimals(itemsPrice > 200 ? 0 : 20);

  const taxPrice = addDecimals(Number((TAX * itemsPrice).toFixed(2)));

  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
