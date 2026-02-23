import dotenv from 'dotenv';
dotenv.config();

import { t } from './translate.js';

const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL_TOKEN, PAYPAL_API_URL_ORDER } = process.env;


export const getPayPalAccessToken = async (req, res, next) => {
  try {
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString('base64');

    const response = await fetch(PAYPAL_API_URL_TOKEN, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      res.status(401);
      throw new Error(req.t('paypal.accessTokenFailed'));
    }

    const paypalData = await response.json();
    return paypalData.access_token;

  } catch (err) {
    console.log(err);
    next(err)
  }

}

export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
  try {
    const orders = await orderModel.find({
      'paymentResult.id': paypalTransactionId,
    })
    return orders.length === 0;
  } catch (err) {
    console.log(err);
    throw err;
  }
}



export const verifyPayPalPayment = async (paypalTransactionId, req, res, next) => {
  try {
    const accessToken = await getPayPalAccessToken(req, res, next);

    if (!accessToken) {
      return;
    }

    const paypalResponse = await fetch(`${PAYPAL_API_URL_ORDER}/${paypalTransactionId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!paypalResponse.ok) {
      res.status(401);
      throw new Error(req.t('paypal.verifyFailed'));
    }
    const paypalData = await paypalResponse.json();

    return {
      verified: paypalData.status === 'COMPLETED',
      value: paypalData.purchase_units[0].amount.value
    }

  } catch (err) {
    next(err);
  }
}


