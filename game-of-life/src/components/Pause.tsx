import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";

interface PauseProps {
  isPaused: boolean;
  togglePause: () => void;
}

const Pause: React.FC<PauseProps> = ({ isPaused, togglePause }) => {
  return (
    <button
      onClick={togglePause}
      className=" cursor-pointer hover:scale-105 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all ease-in flex"
    >
      {isPaused ? (
        <FaPlay className="text-4xl text-green-400" />
      ) : (
        <FaPause className="text-4xl text-white" />
      )}
    </button>
  );
};

export default Pause;
