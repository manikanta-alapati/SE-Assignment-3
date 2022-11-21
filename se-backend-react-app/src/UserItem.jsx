import React from "react";
import "./Profile.css";

function UserItem({ name, bio, profileUrl, email }) {
  return (
    <div className="container d-flex p-3 bg-light rounded border">
      <img
        src={profileUrl}
        className="profile-image rounded border"
        alt={name}
      />
      <div className="d-flex flex-column p-3">
        <div className="mb-2">
          <input
            name="email"
            className="fs-3 p-1 rounded border"
            value={email}
            disabled
          />
        </div>
        <div className="mb-2">
          <input
            name="name"
            disabled
            className="fs-3 p-1 rounded border"
            value={name}
          />
        </div>
        <div>
          <textarea
            rows={5}
            cols={100}
            name="bio"
            style={{ resize: "none" }}
            className="p-2 rounded border"
            value={bio}
            disabled
          />
        </div>
      </div>
    </div>
  );
}

export default UserItem;
