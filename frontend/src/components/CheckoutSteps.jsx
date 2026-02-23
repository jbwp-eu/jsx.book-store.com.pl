import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const { t } = useTranslation();

  return (
    <div className="checkoutSteps">

      {step1 ? <div className="checkoutSteps__step">
        <Link to='/login'>{t('auth.login')}</Link>
      </div> : <div className="checkoutSteps__step">
        <Link to='/login' className='disabled'>{t('auth.login')}</Link>
      </div>
      }

      {step2 ? <div className="checkoutSteps__step">
        <Link to='/shipping'>{t('checkoutSteps.shipping')}</Link>
      </div> : <div className="checkoutSteps__step">
        <Link to='/shipping' className='disabled'>{t('checkoutSteps.shipping')}</Link>
      </div>
      }

      {step3 ? <div className="checkoutSteps__step">
        <Link to='/payment'>{t('checkoutSteps.payment')}</Link>
      </div> : <div className="checkoutSteps__step">
        <Link to='payment' className='disabled'>{t('checkoutSteps.payment')}</Link>
      </div>
      }

      {step4 ? <div className="checkoutSteps__step">
        <Link to='/placeorder'>{t('checkoutSteps.placeOrder')}</Link>
      </div> : <div className="checkoutSteps__step" disabled>
        <Link to='placeorder' className='disabled'>{t('checkoutSteps.placeOrder')}</Link>
      </div>
      }
    </div>
  );
}

export default CheckoutSteps;