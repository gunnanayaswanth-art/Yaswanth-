import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 80; // Faster speed

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [trail, setTrail] = useState<{x: number, y: number, id: number}[]>([]);
  const gameLoopRef = useRef<number | null>(null);
  const trailIdRef = useRef(0);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setTrail([]);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        const tail = newSnake.pop();
        if (tail) {
          setTrail(prev => [{ ...tail, id: trailIdRef.current++ }, ...prev].slice(0, 5));
        }
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center justify-center p-4 font-pixel">
      <div className="mb-6 flex items-center justify-between w-full max-w-[400px] border-b-2 border-neon-magenta pb-2">
        <h2 className="text-xl text-neon-magenta glitch-text" data-text="SNAKE.EXE">SNAKE.EXE</h2>
        <div className="text-sm text-neon-yellow">PTS: {score.toString().padStart(4, '0')}</div>
      </div>

      <div 
        className="relative bg-black border-4 border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* CRT Scanline effect on board */}
        <div className="absolute inset-0 pointer-events-none z-30 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />

        {/* Trail */}
        <AnimatePresence>
          {trail.map((segment, i) => (
            <motion.div
              key={`trail-${segment.id}`}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bg-neon-magenta"
              style={{
                width: '100%',
                height: '100%',
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                zIndex: 8
              }}
            />
          ))}
        </AnimatePresence>

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ x: 0, y: 0 }}
            className={`absolute border border-black ${i === 0 ? 'bg-neon-cyan animate-pulse' : 'bg-neon-cyan/80'}`}
            style={{
              width: '100%',
              height: '100%',
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              zIndex: 10
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            opacity: [1, 0, 1],
            scale: [1, 1.2, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.2, steps: 2 }}
          className="absolute bg-neon-yellow"
          style={{
            width: '100%',
            height: '100%',
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            zIndex: 5
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-neon-magenta/20 backdrop-invert-[0.1]"
            >
              {gameOver ? (
                <div className="bg-black border-4 border-neon-magenta p-6 text-center animate-tearing">
                  <h3 className="text-2xl text-neon-magenta mb-6 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h3>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-neon-magenta text-black font-bold hover:bg-neon-yellow transition-colors uppercase text-xs"
                  >
                    REBOOT_SYS
                  </button>
                </div>
              ) : (
                <div className="bg-black border-4 border-neon-cyan p-6 text-center">
                  <h3 className="text-2xl text-neon-cyan mb-6 glitch-text" data-text="HALTED">HALTED</h3>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 bg-neon-cyan text-black font-bold hover:bg-neon-yellow transition-colors uppercase text-xs"
                  >
                    RESUME_PROC
                  </button>
                  <p className="mt-6 text-[8px] text-neon-yellow animate-pulse tracking-tighter">PRESS_SPACE_TO_TOGGLE</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 text-[8px] text-neon-cyan/60 uppercase tracking-[0.2em] flex items-center gap-2">
        <div className="w-2 h-2 bg-neon-cyan animate-ping" />
        INPUT_STREAM: ACTIVE
      </div>
    </div>
  );
}
