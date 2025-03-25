import React from "react";

interface CellProps {
  active: boolean;
}

const Cell: React.FC<CellProps> = ({ active }) => {
  return (
    <div
      className={`w-[16px] h-[16px] ${active ? "bg-white" : "bg-transparent"}`}
    ></div>
  );
};

export default Cell;
