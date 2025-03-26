import { createContext } from "react";
import { CellsType } from "../GameOfLife";

interface GenerationContextType {
  generations: CellsType[];
  currentGeneraion: CellsType;
  onCurrentGenerationChange: (cells: CellsType) => void;
  nextGeneration: () => void;
  previousGeneration: () => void;
  clearGenerations: () => void;
  currentGenerationIndex: number;
}

export const GenerationContext = createContext<GenerationContextType>({
  generations: [],
  currentGeneraion: {},
  nextGeneration: () => {},
  previousGeneration: () => {},
  clearGenerations: () => {},
  onCurrentGenerationChange: () => {},
  currentGenerationIndex: 0,
});
