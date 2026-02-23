import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Image from './Image.jsx';
import { Link } from 'react-router-dom';
import Message from './Message.jsx';
import Currency from './Currency.jsx';

const OrderInformation = (props) => {
  const { user, cartItems = [], orderItems = [], shippingAddress, paymentMethod, isDelivered, deliveredAt, isPaid, paidAt } = props.data;
  const { currency } = useSelector((state) => state.ui);
  const { t } = useTranslation();

  return (
    <div className="order__information">

      {props.cart && <div className="order__information-shipping">
        <h1>{t('shipping.title')}</h1>
        <p><span>{t('order.address')}</span>{' '}{shippingAddress.address}{', '}{shippingAddress.city}{' '}{shippingAddress.postal_code}{', '}{shippingAddress.country}</p>
      </div>}

      {props.order && <div className="order__information-shipping">
        <h1>{t('order.shippingData')}</h1>
        <p><span>{t('order.name')}</span>{' '}{user?.name}</p>
        <p><span>Email:</span>{' '}{user?.email}</p>
        <p><span>{t('order.address')}</span>{' '}{shippingAddress.address}{', '}{shippingAddress.city}{' '}{shippingAddress.postal_code}{', '}{shippingAddress.country}</p>
        {isDelivered ? <Message variant='success'>{t('order.deliveredOn')} {deliveredAt}</Message> : <Message variant='danger'>{t('order.notDelivered')}</Message>}
      </div>}

      {props.cart && <div className="order__information-payment">
        <h1>{t('payment.title')}</h1>
        <p><span>{t('order.payment')}</span>{' '}{paymentMethod}</p>
      </div>}

      {props.order && <div className="order__information-payment">
        <h1>{t('payment.title')}</h1>
        <p><span>{t('order.method')}</span>{' '}{paymentMethod}</p>
        {isPaid ? <Message variant='success'>{t('order.paidOn')}{paidAt}</Message> : <Message variant='danger'>{t('order.notPaid')}</Message>}

      </div>}

      <h1>{t('order.orderItems')}</h1>
      {props.cart &&
        cartItems.length === 0 ? (<Message>{t('cart.empty')}</Message>) : cartItems?.map((item, index) => (
          <div key={index} className="order__information-items">
            <Image image={item.image} title={item.title} className='order__information-img' />
            <Link to={`/product/${item.id}`}>{item.title}</Link>
            <p>{item.qty} x <Currency currency={currency}>{item.price}</Currency> =<Currency currency={currency} className='currency__bold'> {item.qty * item.price}</Currency> </p>
          </div>
        ))}

      {props.order &&
        orderItems.length === 0 ? (<Message>Your order is empty</Message>) : orderItems.map((item, index) => (
          <div key={index} className="order__information-items">
            <Image image={item.image} title={item.title} className='order__information-img' />
            <Link to={`/product/${item.product}`}>{item.title}</Link>
            <p>{item.qty} x <Currency currency={currency}>{item.price}</Currency> =<Currency currency={currency} className='currency__bold'> {item.qty * item.price}</Currency> </p>
          </div>
        ))}
    </div>
  )
}

export default OrderInformation;