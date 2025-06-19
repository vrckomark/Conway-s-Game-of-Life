import React, { useState } from "react";
import { GenerationContext } from "../contexts/generationContext";
import { CellsType } from "../GameOfLife";
import { getNextGeneration } from "../util/getNextGeneration";

interface GenerationContextProviderProps {
  children: React.ReactNode;
}

const GenerationContextProvider: React.FC<GenerationContextProviderProps> = ({
  children,
}) => {
  const [generations, setGenerations] = useState<CellsType[]>([{}]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextGeneration = () => {
    if (Object.keys(generations[currentIndex]).length === 0) return;
    setCurrentIndex((prev) => prev + 1);
    if (currentIndex >= generations.length - 1)
      return setGenerations((prev: CellsType[]) => {
        return [...prev, getNextGeneration(prev[prev.length - 1])];
      });
  };

  const previousGeneration = () => {
    if (currentIndex !== 0) setCurrentIndex(currentIndex - 1);
  };

  const clearGenerations = () => {
    setGenerations([{}]);
    setCurrentIndex(0);
  };

  const onCurrentGenerationChange = (cells: CellsType) => {
    setGenerations((prev: CellsType[]) => {
      return [...prev.slice(0, currentIndex), cells];
    });
  };

  return (
    <GenerationContext.Provider
      value={{
        currentGenerationIndex: currentIndex,
        generations,
        currentGeneraion: generations[currentIndex] || {},
        onCurrentGenerationChange,
        nextGeneration,
        previousGeneration,
        clearGenerations,
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
};

export default GenerationContextProvider;
