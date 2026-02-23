


const Image = ({ image, title, className }) => {

  let test = image?.slice(0, 7);

  let picture;

  if (test === 'https:/') {
    picture = <img src={image} alt={title} className={className ? className : ''} />
  } else if (test === 'uploads') {
    picture = <img src={`${import.meta.env.VITE_ASSET_URL}/${image}`} alt={title} className={className ? className : ''} />
  }
  else {
    picture = <img src={`/images/${image}.jpg`} alt={title} className={className ? className : ''} />
  }

  return (
    <>
      {picture}
    </>
  );
}

export default Image;