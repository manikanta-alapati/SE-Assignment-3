import React from "react";

function NewsArticle({ name, description, imageUrl, url }) {
  return (
    <div
      className="container d-flex p-3 bg-white rounded border"
      role="button"
      onClick={() => window.open(url, "_blank")}
    >
      <div className="rounded border p-1">
        <img
          src={imageUrl}
          alt="News article"
          className="profile-image rounded"
        />
      </div>
      <div className="d-flex flex-column px-3">
        <p className="fs-3 fw-normal p-1 rounded text-decoration-none text-primary">
          {name}
        </p>
        <p className="p-2 fs-5 fw-light rounded">{description}</p>
      </div>
    </div>
  );
}

export default NewsArticle;
