import React from "react";

const Square = (props) => {
  return (
    <div
      onClick={props.onClick}
      className="flex items-center justify-center w-full text-3xl border-2 border-white border-solid h-28 square "
    >
      {props.value}
    </div>
  );
};

export default Square;