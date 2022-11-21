import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Apis from "./Apis";
import Loader from "./Loader";
import UserItem from "./UserItem";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios
      .request({
        url: "/users/all",
        baseURL: `${process.env.REACT_APP_EXPRESS_URL}`,
        method: "get",
      })
      .then((response) => setUserList(response.data))
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => setIsLoading(false));
  }, []);
  console.log("userList", userList);
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        userList.map(({ name, bio, profileUrl, id, email }) => (
          <div key={id} className="mb-4">
            <UserItem
              name={name}
              bio={bio}
              profileUrl="https://png.pngitem.com/pimgs/s/506-5067022_sweet-shap-profile-placeholder-hd-png-download.png"
              id={id}
              email={email}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;
