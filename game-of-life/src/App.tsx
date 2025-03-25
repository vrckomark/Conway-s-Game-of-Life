import { useState } from "react";
import GameOfLife, { CellsType } from "./GameOfLife";
import { FaPause, FaPlay, FaTrash } from "react-icons/fa";

function App() {
  const [cells, setCells] = useState<CellsType>({});

  const [isPaused, setIsPaused] = useState(false);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const clearCells = () => {
    setCells({});
  };

  return (
    <>
      <GameOfLife cells={cells} setCells={setCells} isPaused={isPaused} />
      <div className="flex items-center fixed bottom-0 left-1/2 mb-12 gap-10">
        <button
          onClick={togglePause}
          className=" cursor-pointer hover:scale-105 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all ease-in flex"
        >
          {isPaused ? (
            <FaPause className="text-4xl text-white" />
          ) : (
            <FaPlay className="text-4xl text-green-400" />
          )}
        </button>
        <button
          onClick={clearCells}
          className="p-4 hover:bg-red-500/10 rounded-xl transition-colors ease-in cursor-pointer"
        >
          <FaTrash className="text-2xl text-red-300" />
        </button>
      </div>
    </>
  );
}

export default App;
