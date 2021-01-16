import React from "react";

const Msg = ({ user, ...e }) => {
  return (
    <div
      className={
        "msg " + (!!user && user.displayName === e.displayName ? "myMsg" : "")
      }
    >
      <div className="name">{e.displayName}</div>
      <div className="content">{e.content}</div>
    </div>
  );
};

export default Msg;
