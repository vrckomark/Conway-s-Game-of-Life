import React from "react";
import Cell from "./Cell";

const Grid = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  return (
    <div
      className="grid gap-0"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(100%, 1fr)`,
        gridTemplateRows: `repeat(100%, 1fr)`,
        width: "100vw",
        height: "100vh",
      }}
    >
      {Array.from({
        length: Math.ceil(screenWidth / 16) * Math.ceil(screenHeight / 16),
      }).map((_, index) => (
        <Cell active={Math.random() < 0.5} key={index} />
      ))}
    </div>
  );
};

export default Grid;
