import ProductForm from "../../components/ProductForm";
import { useLoaderData, useNavigate } from 'react-router-dom';


const EditProductPage = () => {

  const product = useLoaderData();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/admin/productsList');
  }

  return (
    <div className='product-edit'>
      <button className="button" onClick={handleClick}>Go Back</button>
      <ProductForm method='patch' product={product} />
    </div>
  )
}
export default EditProductPage;