import { useNavigation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSubmit } from 'react-router-dom';
import { uiActions } from '../slices/uiSlice';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';

const UserProfileForm = () => {
  const { t } = useTranslation();

  const { userInfo } = useSelector((state => state.auth));

  const dispatch = useDispatch();

  const navigation = useNavigation();
  const navigate = useNavigate();

  let submit = useSubmit();

  let formData = new FormData();

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: object({
      name: string().required('Please enter name'),
      email: string().required('Please enter email address').email('Email address must be a valid address'),
      password: string().required('Please enter password').min(4, 'Must be 4 characters or more'),
      confirmPassword: string().required('Please enter password').min(4, 'Must be 4 characters or more'),

    }),

    onSubmit: values => {
      if (values.password !== values.confirmPassword) {
        dispatch(
          uiActions.showNotification({
            status: 'error',
            title: t('common.error'),
            message: t('userProfile.passwordDoNotMatch'),
          })
        )
      } else {

        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);

        submit(formData, { method: 'put' });
        formik.handleReset();
      }
    }
  })

  const isSubmitting = navigation.state === 'submitting';

  const cancelHandler = () => {
    navigate('..');
  }

  return (
    <div className='profile'>

      <h1>{t('userProfile.title')}</h1>

      <form onSubmit={formik.handleSubmit}>

        <p>
          <label htmlFor='name'>{t('userProfile.name')}</label>
          <input
            id='name'
            type='text'
            placeholder='Enter name'
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </p>
        {formik.touched.name && formik.errors.name ? <p className="form-error">{formik.errors.name}</p> : null}

        <p>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            placeholder='Enter email'
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </p>
        {formik.touched.email && formik.errors.email ? <p className="form-error">{formik.errors.email}</p> : null}

        <p>
          <label htmlFor='password'>{t('userProfile.password')}</label>
          <input
            id='password'
            type='password'
            placeholder='Enter password'
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </p>

        {formik.touched.password && formik.errors.password ? <p className="form-error">{formik.errors.password}</p> : null}

        <p>
          <label htmlFor='confirmPassword'>{t('userProfileForm.confirmPasswordPlaceholder')}</label>
          <input
            id='confirmPassword'
            type='password'
            placeholder='Confirm password'
            name='confirmPassword'
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </p>

        {formik.touched.confirmPassword && formik.errors.confirmPassword ? <p className="form-error">{formik.errors.confirmPassword}</p> : null}

        <div className="actions">
          <button className='button' type="button" disabled={isSubmitting} onClick={cancelHandler}>
            {t('common.cancel')}
          </button>
          <button type='submit' className='button' disabled={isSubmitting}>
            {isSubmitting ? t('common.submitting') : t('userProfile.update')}
          </button>
        </div>

      </form>
    </div >
  );
}

export default UserProfileForm;



