import Container from "./Container";

const Notification = (props) => {
  let specialClasses = '';

  if (props.status === 'error') {
    specialClasses = 'error';
  }
  if (props.status === 'success') {
    specialClasses = 'success';
  }

  const cssClasses = `notification ${specialClasses}`;


  return (
    <section className={cssClasses}>
      <Container className="container--no-vertical-padding">
        <div className="notification__wrapper">
          <p>{props.title}</p>
          <p>{props.message}</p>
        </div>
      </Container>
    </section>
  );
};

export default Notification;
