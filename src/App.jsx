import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const numRows = 15;
const numCols = 15;

const App = () => {
  const [grid, setGrid] = useState(Array(numRows).fill().map(() => Array(numCols).fill('white')));
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [clickPosition, setClickPosition] = useState(null);
  const [color, setColor] = useState('');
  const animationRef = useRef(null);

  const handleClick = (row, col) => {
    if (isAnimating) return; 

    const newColor = getRandomColor();
    setColor(newColor);
    setClickPosition({ row, col });
    setIsAnimating(true);
    setAnimationStep(1);
  };

  useEffect(() => {
    if (!isAnimating || !clickPosition) return;

    const animate = () => {
      const { row, col } = clickPosition;
      const newGrid = grid.map((r) => r.slice());
      
     
      const radius = animationStep;
      const positions = [];
      for (let r = -radius; r <= radius; r++) {
        for (let c = -radius; c <= radius; c++) {
          if (Math.abs(r) === radius || Math.abs(c) === radius) {
            const nr = row + r;
            const nc = col + c;
            if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
              positions.push([nr, nc]);
            }
          }
        }
      }

      // Color the current step boxes
      positions.forEach(([r, c]) => {
        newGrid[r][c] = color;
      });
      setGrid(newGrid);

      // Delay and then clear previous color
      setTimeout(() => {
        const clearPositions = [];
        for (let r = -(radius - 1); r <= (radius - 1); r++) {
          for (let c = -(radius - 1); c <= (radius - 1); c++) {
            if (Math.abs(r) === (radius - 1) || Math.abs(c) === (radius - 1)) {
              const nr = row + r;
              const nc = col + c;
              if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) {
                clearPositions.push([nr, nc]);
              }
            }
          }
        }
        clearPositions.forEach(([r, c]) => {
          newGrid[r][c] = 'white';
        });
        setGrid(newGrid);

        
        if (radius < Math.max(numRows, numCols)) {
          setAnimationStep(animationStep + 1);
          animationRef.current = setTimeout(animate, 1000); 
        } else {
          setIsAnimating(false);
          setAnimationStep(0);
          setClickPosition(null);
        }
      }, 1000); 
    };

    animate();

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating, animationStep, clickPosition, color]);

  return (
    <div className="App">
      <h1>Ripple Effect Grid</h1>
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((col, colIndex) => (
              <Box
                key={colIndex}
                color={grid[rowIndex][colIndex]}
                onClick={() => handleClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Box = ({ color, onClick }) => {
  return (
    <div
      className="box"
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
};


const getRandomColor = () => {
  const colors = ['#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF', '#FF33FF', '#FF5733', '#33FF57'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default App;
