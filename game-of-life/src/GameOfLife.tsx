import { useState, useRef, useMemo, useEffect } from "react";
import { Layer, Rect, Stage } from "react-konva";

const GRID_SIZE = 16; // Size of each cell in pixels

type CellType = Record<string, boolean>;

const GameOfLife = () => {
  const [cells, setCells] = useState<CellType>({});
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Track pan position
  const stageRef = useRef<any>(null);
  const isDragging = useRef(false);
  const isPainting = useRef(false); // For painting cells with left-click
  const isErasing = useRef(false); // For erasing cells with right-click
  const lastPos = useRef({ x: 0, y: 0 });

  const canvasWidth = Math.ceil(window.innerWidth);
  const canvasHeight = Math.ceil(window.innerHeight);

  // Paint a cell by setting its value to true
  const paintCell = (x: number, y: number) => {
    const key = `${x},${y}`;
    setCells((prev) => {
      if (prev[key]) return prev; // If cell is already painted, don't re-paint
      return { ...prev, [key]: true };
    });
  };

  // Erase a cell by removing it from the state
  const eraseCell = (x: number, y: number) => {
    const key = `${x},${y}`;
    setCells((prev) => {
      const newCells = { ...prev };
      delete newCells[key];
      return newCells;
    });
  };

  const handleMouseDown = (e: any) => {
    if (e.evt.button === 1) {
      // Middle click to drag
      isDragging.current = true;
      lastPos.current = { x: e.evt.clientX, y: e.evt.clientY };
    } else if (e.evt.button === 0) {
      // Left click to paint
      isPainting.current = true;
      handlePaint(e, "paint");
    } else if (e.evt.button === 2) {
      // Right click to erase
      isErasing.current = true;
      handlePaint(e, "erase");
    }
  };

  const animationFrame = useRef<number | null>(null);

  const handleMouseMove = (e: any) => {
    if (!isDragging.current && !isPainting.current && !isErasing.current)
      return;

    // Middle-click to drag the canvas
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

    // Erase if right-click is held
    if (isErasing.current) {
      handlePaint(e, "erase");
    }

    // Paint if left-click is held
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
      // If the right or middle button was released, stop dragging
      isDragging.current = false;
    }
    if (e.evt.button === 0) {
      // Stop painting when left button is released
      isPainting.current = false;
    }
    if (e.evt.button === 2) {
      // Stop erasing when right button is released
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
    return Object.keys(cells).map((key) => {
      const [x, y] = key.split(",").map(Number);
      return (
        <Rect
          key={key}
          x={x * GRID_SIZE - offset.x}
          y={y * GRID_SIZE - offset.y}
          width={GRID_SIZE}
          height={GRID_SIZE}
          fill="white"
          onClick={() => paintCell(x, y)} // Left click action (paint)
        />
      );
    });
  }, [cells, offset]);

  return (
    <Stage
      ref={stageRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.evt.preventDefault()} // Prevent right-click context menu
    >
      <Layer>{visibleCells}</Layer>
    </Stage>
  );
};

export default GameOfLife;
