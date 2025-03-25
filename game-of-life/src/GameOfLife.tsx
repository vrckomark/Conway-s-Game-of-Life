import { useState, useRef, useMemo, useEffect } from "react";
import { Layer, Rect, Stage } from "react-konva";

const GRID_SIZE = 30; // Size of each cell in pixels

type CellType = Record<string, boolean>;

const GameOfLife = () => {
  const [cells, setCells] = useState<CellType>({});
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Track pan position
  const stageRef = useRef<any>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const isPainting = useRef(false);

  const canvasWidth = Math.ceil(window.innerWidth * 1.1);
  const canvasHeight = Math.ceil(window.innerHeight * 1.1);

  const toggleCell = (x: number, y: number) => {
    const key = `${x},${y}`;
    setCells((prev) => ({
      ...prev,
      [key]: !prev[key], // Toggle color on click
    }));
  };

  const handleMouseDown = (e: any) => {
    if (e.evt.button === 1) {
      // Middle click to drag
      isDragging.current = true;
      lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
    } else if (e.evt.button === 0) {
      // Left click to paint
      isPainting.current = true;
      handlePaint(e);
    }
  };

  const animationFrame = useRef<number | null>(null);

  const handleMouseMove = (e: any) => {
    if (isDragging.current) {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);

      animationFrame.current = requestAnimationFrame(() => {
        const dx = lastPos.current.x - e.evt.clientX;
        const dy = lastPos.current.y - e.evt.clientY;
        setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
      });
    } else if (isPainting.current) {
      handlePaint(e);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);
  const handleMouseUp = (e: any) => {
    if (e.evt.button === 1) isDragging.current = false;
    if (e.evt.button === 0) isPainting.current = false;
  };

  const handlePaint = (e: any) => {
    const stage = stageRef.current;
    if (stage) {
      const pointer = stage.getPointerPosition();
      const x = Math.floor((pointer.x + offset.x) / GRID_SIZE);
      const y = Math.floor((pointer.y + offset.y) / GRID_SIZE);
      toggleCell(x, y);
    }
  };

  // Calculate visible cells dynamically
  const visibleCells = useMemo(() => {
    const cellsToRender = [];
    for (
      let x = Math.floor(offset.x / GRID_SIZE);
      x < (offset.x + canvasWidth) / GRID_SIZE;
      x++
    ) {
      for (
        let y = Math.floor(offset.y / GRID_SIZE);
        y < (offset.y + canvasHeight) / GRID_SIZE;
        y++
      ) {
        const key = `${x},${y}`;
        cellsToRender.push(
          <Rect
            key={key}
            x={x * GRID_SIZE - offset.x}
            y={y * GRID_SIZE - offset.y}
            width={GRID_SIZE}
            height={GRID_SIZE}
            fill={cells[key] ? "white" : "#020202"}
            onClick={() => toggleCell(x, y)}
          />
        );
      }
    }
    return cellsToRender;
  }, [offset, cells]); // Only re-calculate when offset or cells change

  return (
    <Stage
      ref={stageRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>{visibleCells}</Layer>
    </Stage>
  );
};

export default GameOfLife;
