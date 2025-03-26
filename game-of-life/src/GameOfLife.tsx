import { useState, useRef, useMemo, useEffect, act, useContext } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { GenerationContext } from "./contexts/generationContext";

const GRID_SIZE = 16;

export type CellsType = Record<string, boolean>;

interface GameOfLifeProps {
  isPaused: boolean;
}

const GameOfLife: React.FC<GameOfLifeProps> = ({ isPaused }) => {
  const { currentGeneraion, onCurrentGenerationChange, nextGeneration } =
    useContext(GenerationContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<any>(null);
  const isDragging = useRef(false);
  const isPainting = useRef(false);
  const isErasing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const canvasWidth = Math.ceil(window.innerWidth);
  const canvasHeight = Math.ceil(window.innerHeight);

  const paintCell = (x: number, y: number) => {
    if (!isPaused) return;
    const key = `${x},${y}`;
    if (currentGeneraion[key]) return;
    onCurrentGenerationChange({ ...currentGeneraion, [key]: true });
  };

  const eraseCell = (x: number, y: number) => {
    if (!isPaused) return;

    const key = `${x},${y}`;
    const newCells = { ...currentGeneraion };
    delete newCells[key];
    onCurrentGenerationChange(newCells);
  };

  const handleMouseDown = (e: any) => {
    if (e.evt.button === 1) {
      isDragging.current = true;
      lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
    } else if (e.evt.button === 0) {
      isPainting.current = true;
      handlePaint(e, "paint");
    } else if (e.evt.button === 2) {
      isErasing.current = true;
      handlePaint(e, "erase");
    }
  };

  const animationFrame = useRef<number | null>(null);

  const handleMouseMove = (e: any) => {
    if (!isDragging.current && !isPainting.current && !isErasing.current)
      return;

    if (isDragging.current) {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);

      animationFrame.current = requestAnimationFrame(() => {
        const dx = lastPos.current.x - e.evt.clientX;
        const dy = lastPos.current.y - e.evt.clientY;
        setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
      });
      return;
    }

    if (isErasing.current) {
      handlePaint(e, "erase");
    }

    if (isPainting.current) {
      handlePaint(e, "paint");
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  const handleMouseUp = (e: any) => {
    if (e.evt.button === 1 || e.evt.button === 2) {
      isDragging.current = false;
    }
    if (e.evt.button === 0) {
      isPainting.current = false;
    }
    if (e.evt.button === 2) {
      isErasing.current = false;
    }
  };

  const handlePaint = (e: any, action: "paint" | "erase") => {
    const stage = stageRef.current;
    if (stage) {
      const pointer = stage.getPointerPosition();
      const x = Math.floor((pointer.x + offset.x) / GRID_SIZE);
      const y = Math.floor((pointer.y + offset.y) / GRID_SIZE);
      if (action === "paint") {
        paintCell(x, y);
      } else if (action === "erase") {
        eraseCell(x, y);
      }
    }
  };

  const visibleCells = useMemo(() => {
    return Object.keys(currentGeneraion).map((key) => {
      const [x, y] = key.split(",").map(Number);
      return (
        <Rect
          key={key}
          x={x * GRID_SIZE - offset.x}
          y={y * GRID_SIZE - offset.y}
          width={GRID_SIZE}
          height={GRID_SIZE}
          fill="white"
          onClick={() => paintCell(x, y)}
        />
      );
    });
  }, [currentGeneraion, offset]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      act(() => {
        nextGeneration();
      });
    }, 150);
    return () => clearInterval(interval);
  }, [currentGeneraion, isPaused]);

  return (
    <Stage
      ref={stageRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.evt.preventDefault()}
    >
      <Layer>{visibleCells}</Layer>
    </Stage>
  );
};

export default GameOfLife;
