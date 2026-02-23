import { Link } from 'react-router-dom';

const AdminNavDropdown = ({ onHandleAdminToggle }) => {
  return (
    <div className="dropdown dropdown--admin" onMouseLeave={onHandleAdminToggle}>
      <Link to="/admin/productsList">Products</Link>
      <Link to="/admin/usersList">Users</Link>
      <Link to="/admin/ordersList">Orders</Link>
    </div >
  );
}

export default AdminNavDropdown;
