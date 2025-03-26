import { useContext, useState } from "react";
import GameOfLife from "./GameOfLife";
import Pause from "./components/Pause";
import Clear from "./components/Clear";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GenerationContext } from "./contexts/generationContext";

function App() {
  const {
    currentGeneraion,
    nextGeneration,
    previousGeneration,
    clearGenerations,
    currentGenerationIndex,
  } = useContext(GenerationContext);
  const [isPaused, setIsPaused] = useState(true);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <>
      <GameOfLife isPaused={isPaused} />
      <div className="absolute left-0 flex flex-col gap-4 top-0 rounded-xl ml-10 mt-10 bg-stone-950/70 py-3 px-6">
        <div className="flex items-center gap-6">
          <p className="text-white text-4xl min-w-2/3">Generation:</p>
          <p className="text-white text-5xl">{currentGenerationIndex}</p>
        </div>
        <div className="flex items-center gap-6">
          <p className="text-white text-4xl min-w-2/3">Population:</p>
          <p className="text-white text-5xl">
            {Object.keys(currentGeneraion).length}
          </p>
        </div>
      </div>
      <div className="flex items-center fixed bottom-0 -translate-x-1/2 left-1/2 mb-12 gap-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => previousGeneration()}
            className="p-4 hover:bg-blue-500/10 rounded-xl transition-colors ease-in cursor-pointer"
          >
            <FaChevronLeft className="text-4xl text-white" />
          </button>
          <Pause isPaused={isPaused} togglePause={togglePause} />
          <button
            onClick={() => nextGeneration()}
            className="p-4 hover:bg-blue-500/10 rounded-xl transition-colors ease-in cursor-pointer"
          >
            <FaChevronRight className="text-4xl text-white" />
          </button>
        </div>
        <Clear clearCells={clearGenerations} />
      </div>
    </>
  );
}

export default App;
