import React, { useRef, useState } from "react";

const ResizableCodeBlock = ({ text }: { text: string }) => {
  const [dimensions, setDimensions] = useState({ width: 600, height: 200 });
  const [isDragging, setIsDragging] = useState({ vertical: false, horizontal: false, corner: false });
  const dragStart = useRef({ x: 0, y: 0 });
  const startDimensions = useRef({ width: 0, height: 0 });

  const handleMouseDown = (
    e: React.MouseEvent,
    direction: { vertical: boolean; horizontal: boolean; corner: boolean },
  ) => {
    e.preventDefault();
    setIsDragging(direction);
    dragStart.current = { x: e.clientX, y: e.clientY };
    startDimensions.current = { ...dimensions };
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDragging.vertical && !isDragging.horizontal && !isDragging.corner) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    const newDimensions = { ...dimensions };

    if (isDragging.horizontal || isDragging.corner) {
      newDimensions.width = Math.max(300, startDimensions.current.width + deltaX);
    }

    if (isDragging.vertical || isDragging.corner) {
      newDimensions.height = Math.max(100, startDimensions.current.height + deltaY);
    }

    setDimensions(newDimensions);
  };

  const handleMouseUp = () => {
    setIsDragging({ vertical: false, horizontal: false, corner: false });
  };

  React.useEffect(() => {
    if (isDragging.vertical || isDragging.horizontal || isDragging.corner) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="relative inline-block">
      <div
        className="relative bg-gray-900 rounded-lg overflow-hidden"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      >
        {/* Code content */}
        <pre className="p-4 text-gray-100 overflow-auto h-full">
          <code>{text}</code>
        </pre>

        {/* Bottom resize handle */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700 cursor-row-resize hover:bg-blue-500 transition-colors"
          onMouseDown={e => handleMouseDown(e, { vertical: true, horizontal: false, corner: false })}
        />

        {/* Right resize handle */}
        <div
          className="absolute top-0 right-0 bottom-0 w-2 bg-gray-700 cursor-col-resize hover:bg-blue-500 transition-colors"
          onMouseDown={e => handleMouseDown(e, { vertical: false, horizontal: true, corner: false })}
        />

        {/* Corner resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-gray-700 cursor-nw-resize hover:bg-blue-500 transition-colors rounded-bl"
          onMouseDown={e => handleMouseDown(e, { vertical: true, horizontal: true, corner: true })}
        />
      </div>
    </div>
  );
};

export default ResizableCodeBlock;
