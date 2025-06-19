import React from "react";
import { FaTrash } from "react-icons/fa";

interface ClearProps {
  clearCells: () => void;
}

const Clear: React.FC<ClearProps> = ({ clearCells }) => {
  return (
    <button
      onClick={clearCells}
      className="p-4 hover:bg-red-500/10 rounded-xl transition-colors ease-in cursor-pointer"
    >
      <FaTrash className="text-2xl text-red-300" />
    </button>
  );
};

export default Clear;
