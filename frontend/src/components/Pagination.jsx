

import { NavLink } from 'react-router-dom';

const Pagination = ({ pages, keyword, isAdmin = false }) => {

  return (
    <div className="pagination">
      <ul >
        {[...Array(pages).keys()].map(item => (
          <li
            key={item + 1}
          >
            <NavLink
              to={
                !isAdmin
                  ? (keyword ? `/search/${keyword}/page/${item + 1}`
                    : `/page/${item + 1}`) : `/admin/productslist/${item + 1}`
              }
            >
              {item + 1}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pagination;