"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  drawingDataUrl: string;
  onChange: (url: string) => void;
}

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 360;

export default function DesignSketch({ drawingDataUrl, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyIndexRef = useRef(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [penWidth, setPenWidth] = useState(3);
  const [penColor, setPenColor] = useState("#000000");

  const getCanvas = () => canvasRef.current;

  const updateHistoryState = (next: string[], nextIndex: number) => {
    historyIndexRef.current = nextIndex;
    setHistory(next);
    setHistoryIndex(nextIndex);
  };

  const getCanvasContext = () => {
    const canvas = getCanvas();
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : penColor;
    return ctx;
  };

  const setCanvasFromUrl = (url: string) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!url) return;

    const image = new Image();
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = url;
  };

  const initializeHistory = (url: string) => {
    const initialValue = url || "";
    updateHistoryState([initialValue], 0);
  };

  useEffect(() => {
    const currentIndex = historyIndexRef.current;
    const currentValue = currentIndex >= 0 ? history[currentIndex] : undefined;
    if (drawingDataUrl === undefined || drawingDataUrl === currentValue) {
      return;
    }

    setCanvasFromUrl(drawingDataUrl);
    initializeHistory(drawingDataUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawingDataUrl]);

  const getPointer = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = getCanvas();
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: x * scaleX,
      y: y * scaleY,
    };
  };

  const saveHistory = () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const currentIndex = historyIndexRef.current;
    const nextHistory = history.slice(0, currentIndex + 1).concat(url);
    updateHistoryState(nextHistory, nextHistory.length - 1);
    onChange(url);
  };

  const handlePointerDown = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    const { x, y } = getPointer(e);
    const ctx = getCanvasContext();
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const handlePointerMove = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPointer(e);
    const ctx = getCanvasContext();
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveHistory();
  };

  const clearCanvas = () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const currentIndex = historyIndexRef.current;
    const nextHistory = history.slice(0, currentIndex + 1).concat("");
    updateHistoryState(nextHistory, nextHistory.length - 1);
    onChange("");
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    const prevIndex = historyIndexRef.current - 1;
    historyIndexRef.current = prevIndex;
    setHistoryIndex(prevIndex);
    setCanvasFromUrl(history[prevIndex]);
    onChange(history[prevIndex]);
  };

  const redo = () => {
    if (historyIndexRef.current >= history.length - 1) return;
    const nextIndex = historyIndexRef.current + 1;
    historyIndexRef.current = nextIndex;
    setHistoryIndex(nextIndex);
    setCanvasFromUrl(history[nextIndex]);
    onChange(history[nextIndex]);
  };

  const saveSketch = () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const currentIndex = historyIndexRef.current;
    const nextHistory = history.slice(0, currentIndex + 1).concat(url);
    updateHistoryState(nextHistory, nextHistory.length - 1);
    onChange(url);
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={undo}
          disabled={historyIndex <= 0}
        >
          Undo
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
        >
          Redo
        </button>
        <button
          type="button"
          className={`btn ${tool === "eraser" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTool(tool === "eraser" ? "pen" : "eraser")}
        >
          {tool === "eraser" ? "Using eraser" : "Eraser"}
        </button>
        <label className="d-flex align-items-center gap-2 mb-0">
          Width
          <input
            type="range"
            min="1"
            max="24"
            value={penWidth}
            onChange={(event) => setPenWidth(Number(event.target.value))}
          />
          <span>{penWidth}px</span>
        </label>
        <label className="d-flex align-items-center gap-2 mb-0">
          Color
          <input
            type="color"
            value={penColor}
            onChange={(event) => setPenColor(event.target.value)}
            disabled={tool === "eraser"}
          />
        </label>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={clearCanvas}
        >
          Clear
        </button>
      </div>

      <div className="mb-3">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-100 border rounded"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerEnd}
          onMouseLeave={handlePointerEnd}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerEnd}
        />
      </div>
    </div>
  );
}
