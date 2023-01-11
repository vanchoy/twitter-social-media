import { Link, Form, useLoaderData } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from "../assets/logo.png";

export default function Header() {
  const user = useLoaderData();
  console.log(user);

  return (
    <header className="header center clearfix">
      <div className="logo-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <input className="menu-btn" type="checkbox" id="menu-btn" />
      <label className="menu-icon" htmlFor="menu-btn">
        <FontAwesomeIcon className="navicon" icon="bars" size="1x" />
      </label>
      <ul className="menu">
      <li className="dropdown">
        <Link className="menu_item" to={user.isAuthenticated != true ? "/" : `/${user.username}`}>
          <FontAwesomeIcon className="icon_menu_li" icon="user" size="1x" />
            Account
        </Link>
          <ul className="dropdown-content">  
          {
            user.isAuthenticated != true ? (
              <>
                <li>
                  <Link className="menu_item" to="/login">
                    <FontAwesomeIcon className="icon_menu_li" icon="right-to-bracket" size="1x" />
                    Login
                  </Link>
                </li>
                <li>
                    <Link className="menu_item" to="/register">
                      <FontAwesomeIcon className="icon_menu_li" icon="user-plus" size="1x" />
                      Register
                    </Link>
                </li>
              </>
            )
            :
            (
              <Form method="post" action="/logout">
                <li>
                  <Link className="menu_item" to="/addpost">
                    <FontAwesomeIcon className="icon_menu_li" icon="plus" size="1x" />
                      Add Post
                  </Link>
                </li>            
                <li>
                  <Link className="menu_item" to="/myposts">
                    <FontAwesomeIcon className="icon_menu_li" icon="gear" size="1x" />
                      Settings
                  </Link>
                </li>
                <li>
                  <button className="menu_item menu_item_button" type="submit">
                    <FontAwesomeIcon className="icon_menu_li" icon="person-walking-arrow-right" size="1x" />
                      Logout
                  </button>
                </li>
              </Form>
            )
          }          
          </ul>
        </li>
        <li>
          <Link className="menu_item" to="/explore">
            <FontAwesomeIcon className="icon_menu_li" icon="globe" size="1x" />
              Explore
          </Link>
        </li>
        <li>
          <Link className="menu_item" to="/public/local">
            <FontAwesomeIcon className="icon_menu_li" icon="people-group" size="1x" />
              Local
          </Link>
        </li>
        {
          user.isAuthenticated === true && (
            <li>
              <Link className="menu_item" to="/favorites">
                <FontAwesomeIcon className="icon_menu_li" icon="star" size="1x" />
                  Favorites
              </Link>
            </li>
          )
        }
      </ul>
    </header>
  );
};