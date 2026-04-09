import { useState, useCallback, useEffect } from 'react';

export type GemType = 'gem1' | 'gem2' | 'gem3' | 'gem4' | 'gem5' | 'gem6';

export interface GemData {
  id: string;
  type: GemType;
}

export const GEM_TYPES: GemType[] = ['gem1', 'gem2', 'gem3', 'gem4', 'gem5', 'gem6'];
export const GRID_SIZE = 8;

const getRandomGem = (exclude: GemType[] = []): GemType => {
  const available = GEM_TYPES.filter(t => !exclude.includes(t));
  if (available.length === 0) return GEM_TYPES[0]; // Fallback
  return available[Math.floor(Math.random() * available.length)];
};

export interface FloatingScore {
  id: string;
  score: number;
  r: number;
  c: number;
}

export const useGameLogic = () => {
  const [board, setBoard] = useState<GemData[][]>([]);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('match3_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Generate an initial board with no matches
  const initializeBoard = useCallback(() => {
    const newBoard: GemData[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: GemData[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const exclude: GemType[] = [];
        
        // Prevent horizontal match
        if (c >= 2 && row[c - 1].type === row[c - 2].type) {
          exclude.push(row[c - 1].type);
        }
        
        // Prevent vertical match
        if (r >= 2 && newBoard[r - 1][c].type === newBoard[r - 2][c].type) {
          exclude.push(newBoard[r - 1][c].type);
        }
        
        const type = getRandomGem(exclude);
        row.push({
          id: `init-${r}-${c}-${Math.random().toString(36).substring(2, 9)}`,
          type
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setScore(0);
    setIsProcessing(false);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Update high score in local storage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('match3_highscore', score.toString());
    }
  }, [score, highScore]);

  // Check for matches of 3 or more horizontally and vertically
  const checkForMatches = useCallback((currentBoard: GemData[][]) => {
    const matches = new Set<string>();

    // Check horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        let matchLength = 1;
        while (
          c + matchLength < GRID_SIZE &&
          currentBoard[r][c].type === currentBoard[r][c + matchLength].type
        ) {
          matchLength++;
        }
        
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matches.add(`${r},${c + i}`);
          }
        }
      }
    }

    // Check vertical
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        let matchLength = 1;
        while (
          r + matchLength < GRID_SIZE &&
          currentBoard[r][c].type === currentBoard[r + matchLength][c].type
        ) {
          matchLength++;
        }
        
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matches.add(`${r + i},${c}`);
          }
        }
      }
    }

    return matches;
  }, []);

  // Helper to process matches purely
  const processBoardMatches = useCallback((currentBoard: GemData[][], matches: Set<string>): GemData[][] => {
    const tempBoard: (GemData | null)[][] = currentBoard.map(row => [...row]);

    // Remove matches
    matches.forEach(pos => {
      const [r, c] = pos.split(',').map(Number);
      tempBoard[r][c] = null;
    });

    const newBoard: GemData[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      newBoard.push(new Array(GRID_SIZE).fill(null));
    }

    // Process columns: move down and fill empty
    for (let c = 0; c < GRID_SIZE; c++) {
      let writeRow = GRID_SIZE - 1;
      
      // Move existing gems down
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (tempBoard[r][c] !== null) {
          newBoard[writeRow][c] = tempBoard[r][c] as GemData;
          writeRow--;
        }
      }
      
      // Fill the rest at the top with new gems
      for (let r = writeRow; r >= 0; r--) {
        newBoard[r][c] = {
          id: `new-${r}-${c}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: getRandomGem()
        };
      }
    }

    return newBoard;
  }, []);

  // Remove matched gems and fill the empty spaces
  const removeMatchesAndFill = useCallback((matches: Set<string>) => {
    if (matches.size === 0) return;
    setBoard(prevBoard => processBoardMatches(prevBoard, matches));
    
    const points = matches.size * 10;
    setScore(prev => prev + points);

    const arr = Array.from(matches);
    const [r, c] = arr[0].split(',').map(Number);
    const newFloatingScore = { id: Date.now().toString(), score: points, r, c };
    setFloatingScores(prev => [...prev, newFloatingScore]);
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(f => f.id !== newFloatingScore.id));
    }, 1000);
  }, [processBoardMatches]);

  const swapGems = useCallback(async (r1: number, c1: number, r2: number, c2: number) => {
    if (isProcessing) return;
    setIsProcessing(true);

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      const temp = newBoard[r1][c1];
      newBoard[r1][c1] = newBoard[r2][c2];
      newBoard[r2][c2] = temp;
      return newBoard;
    });

    // Wait for swap animation
    await new Promise(resolve => setTimeout(resolve, 300));

    setBoard(currentBoard => {
      const matches = checkForMatches(currentBoard);
      
      if (matches.size === 0) {
        // Swap back if no match
        setTimeout(() => {
          setBoard(boardBeforeRevert => {
            const revertedBoard = boardBeforeRevert.map(row => [...row]);
            const tempBack = revertedBoard[r1][c1];
            revertedBoard[r1][c1] = revertedBoard[r2][c2];
            revertedBoard[r2][c2] = tempBack;
            return revertedBoard;
          });
          setTimeout(() => setIsProcessing(false), 300);
        }, 0);
        return currentBoard;
      }

      // Start combo loop
      const runComboLoop = async (boardToProcess: GemData[][]) => {
        let currentMatches = checkForMatches(boardToProcess);
        let currentIterBoard = boardToProcess;
        let combo = 1;

        while (currentMatches.size > 0) {
          // Add score
          const points = currentMatches.size * 10 * combo;
          setScore(s => s + points);

          const arr = Array.from(currentMatches);
          const [firstR, firstC] = arr[0].split(',').map(Number);
          const newFloatingScore = {
            id: Math.random().toString(),
            score: points,
            r: firstR,
            c: firstC
          };
          setFloatingScores(prev => [...prev, newFloatingScore]);
          setTimeout(() => {
            setFloatingScores(prev => prev.filter(f => f.id !== newFloatingScore.id));
          }, 1000);
          
          currentIterBoard = processBoardMatches(currentIterBoard, currentMatches);
          setBoard(currentIterBoard);

          // Wait for drop animation
          await new Promise(resolve => setTimeout(resolve, 400));
          
          currentMatches = checkForMatches(currentIterBoard);
          combo++;
        }

        setIsProcessing(false);
      };

      runComboLoop(currentBoard);
      return currentBoard;
    });

  }, [isProcessing, checkForMatches, processBoardMatches]);

  return {
    board,
    score,
    highScore,
    isProcessing,
    floatingScores,
    initializeBoard,
    checkForMatches,
    removeMatchesAndFill,
    swapGems,
  };
};
