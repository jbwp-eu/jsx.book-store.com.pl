import Image from "./Image";
import { Link } from 'react-router-dom';
import { addDecimals } from "../utils/cartUtils";
import { useDispatch } from 'react-redux';
import { addItemToCart } from "../slices/cartSlice";
import { FaTrash } from "react-icons/fa";
import { removeItemFromCart } from "../slices/cartSlice";
import { useContext } from 'react';
import { AppContext } from './AppProvider';
import Currency from "./Currency";


const CartItem = ({ item }) => {

  const { id, image, title, price, qty, countInStock } = item;
  const dispatch = useDispatch();

  const { currency, lang } = useContext(AppContext);

  const addToCartHandler = (product, qty) => {
    dispatch(addItemToCart({ ...product, qty }));
  }

  const removeFromCartHandler = (id) => {
    dispatch(removeItemFromCart(id))
  }

  const totalItemPrice = addDecimals(price * qty);

  return (
    <li className="cart__item" key={item.id}>
      <Image image={image} title={title} className='cart__item-img' />
      <Link to={`/product/${id}`}>
        <h3>{title}</h3>
      </Link>
      <div className="cart__item-group">
        <select
          value={item.qty}
          onChange={(e) => addToCartHandler(item, (Number(e.target.value)))}
        >
          {[...Array(countInStock).keys()].map(x => (
            <option
              key={x + 1}
              value={x + 1}
            >
              {x + 1}
            </option>
          ))}
        </select>
        <div >
          <p><Currency currency={currency}>{totalItemPrice}</Currency></p>
          <p><Currency currency={currency}>{price}</Currency> {lang === 'PL' ? '/ szt.' : '/ item'} </p>
        </div>
        <button className="item-trash" onClick={() => removeFromCartHandler(id)}>
          <FaTrash />
        </button>
      </div>
    </li>
  );
}

export default CartItem;