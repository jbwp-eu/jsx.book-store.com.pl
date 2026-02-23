import { useRouteError } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import Container from "../components/Container.jsx";
import Header from '../components/Header';
import Message from '../components/Message';
import Footer from '../components/Footer.jsx';

const ErrorPage = () => {
  const error = useRouteError();
  const { t } = useTranslation();
  let title = t("common.errorOccurred");

  return (
    <>
      <Header />
      <main>
        <Container>
          <Message variant='danger'>
            <h1>{title}</h1>
            <p>{error.message || error}</p>
          </Message>
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default ErrorPage;