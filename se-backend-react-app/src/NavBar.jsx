import React from "react";

function NavBar({ navItems, userName, onUserNameChange, rightNavItems }) {
  return (
    <div className="container-fluid bg-light shadow m-0 p-2">
      <div className="container d-flex align-items-center">
        <div className="d-flex align-items-center me-4">
          <div className="logo-container me-2 bg-primary rounded d-flex justify-content-center align-items-center">
            <span role="button" className="text-white fs-3 fw-bold my-0">
              B
            </span>
          </div>
          <span role="button" className="fs-5 my-0">
            Media Library
          </span>
        </div>
        <div className="d-flex align-items-center">
          {navItems.map(({ id, title, onClick }) => (
            <span key={id} role="button" onClick={onClick} className="p-2 my-0">
              {title}
            </span>
          ))}
        </div>
        <div className="ms-auto">
          {rightNavItems.map(({ id, title, onClick }) => (
            <span key={id} role="button" onClick={onClick} className="p-2 my-0">
              {title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
