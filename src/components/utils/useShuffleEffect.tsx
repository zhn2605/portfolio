'use client';
import React, { useState, useEffect, useRef } from 'react';

const SYMBOLS = "!@#$%^&*()_+x.,/<>?;:[]{}|-=";

// ease function for smoother animation
const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 16 * t* t * t * t * t: 1 - Math.pow(-2 * t + 2, 5) / 2;
};

type ShuffleTextOptions = {
    lookupInitialSpeed?: number;
    fixerInitialSpeed?: number;
    scrambleChance?: number;
    leaveChance?: number;
    scrambleChangeChance?: number;
};

// sliding window shuffle effect
const useShuffleEffect = (content: string, options: ShuffleTextOptions = {}) => {
    // settings
    const {
        lookupInitialSpeed = 8,
        fixerInitialSpeed = 4,
        scrambleChance = 0.15,
        leaveChance = 0.05,
        scrambleChangeChance = 0.2
    } = options;

    const [displayContent, setDisplayContent] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef<number | null>(null);
    const cancelledRef = useRef(false);

    const contentTo2D = (text: string) => {
        return text.split('\n').map(line => line.split(''));
    };

    const flatten2D = (arr: string[][]) => {
        return arr.map(line =>line.join('')).join('\n');
    };

    const appear = () => {
        setIsAnimating(true);

        const lines = contentTo2D(content);
        const totalChars = lines.reduce((sum, line) => sum + line.length, 0);

        // initalize all as spaces
        const workingLines = lines.map(line => line.map(() => ' '));

        let lookupPos = 0;
        let fixerPos = 0;
        let frame = 0;
        const totalFrames = Math.max(50, Math.floor(totalChars / 10));

        const getCharAt = (pos: number) => {
            let count = 0;
            for (let i = 0; i < lines.length; i++) {
                if (count + lines[i].length > pos) {
                    return { row: i, col: pos - count };
                }
                count += lines[i].length;
            }
            return null;
        };

        const animate = () => {
            if (cancelledRef.current) {
                setIsAnimating(false);
                return;
            }

            frame++;
            const progress =Math.min(frame / totalFrames, 1);
            const easedProgress = easeInOutCubic(progress);

            // update lookup and fixer positions
            const lookupSpeed = Math.min(totalChars, Math.floor(lookupInitialSpeed * (.5 + easedProgress * 1.5)));
            const fixerSpeed = Math.min(totalChars, Math.floor(fixerInitialSpeed * (.5 + easedProgress * 1.5)));

            // move lookup pointer
            lookupPos = Math.min(lookupPos + lookupSpeed, totalChars);

            // move fixer pointer
            fixerPos = Math.min(fixerPos + fixerSpeed, totalChars);

            // lookup pass: scramble characters
            for (let i = Math.max(0, lookupPos - lookupSpeed); i < lookupPos; i++) {
                const pos = getCharAt(i);
                if (pos && lines[pos.row][pos.col] !== ' ' && lines[pos.row][pos.col] !== '\n') {
                    if (Math.random() < scrambleChance) {
                      workingLines[pos.row][pos.col] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    }
                }
            }

            // update existing scrambled chars between fixer and lookup
            for (let i = fixerPos; i < lookupPos; i++) {
              const pos = getCharAt(i);
              if (pos) {
                const char = workingLines[pos.row][pos.col];
                if (SYMBOLS.includes(char) && Math.random() < scrambleChangeChance) {
                  workingLines[pos.row][pos.col] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                }
                // saces can still become scrambled if they haven't been fixed yet
                if (char === ' ' && lines[pos.row][pos.col] !== ' ' && lines[pos.row][pos.col] !== '\n' && Math.random() < scrambleChance) {
                  workingLines[pos.row][pos.col] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                }
              }
            }

            // fixer pass: fix characters
            for (let i = Math.max(0, fixerPos - fixerSpeed); i < fixerPos; i++) {
                const pos = getCharAt(i);
                if (pos) {
                    workingLines[pos.row][pos.col] = lines[pos.row][pos.col];
                }
            }

            setDisplayContent(flatten2D(workingLines));

            if (fixerPos < totalChars) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // check for correctness
                for (let i = 0; i < lines.length; i++) {
                    for (let j = 0; j < lines[i].length; j++) {
                        workingLines[i][j] = lines[i][j];
                    }
                }
                setDisplayContent(flatten2D(workingLines));
                setIsAnimating(false);
            }
        };

        animate();
    };

    const dissolve = (onHalfway?: () => void) => {
        cancelledRef.current = false;
        setIsAnimating(true);

        const lines = contentTo2D(content);
        const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
        const workingLines = contentTo2D(content);

        let lookupPos = 0;
        let fixerPos = 0;
        let frame = 0;
        const totalFrames = Math.max(50, Math.floor(totalChars / 10));
        let halfwayTriggered = false;

        const getCharAt = (pos: number) => {
            let count = 0;
            for (let i = 0; i < lines.length; i++) {
                if (count + lines[i].length > pos) {
                    return { row: i, col: pos - count };
                }
                count += lines[i].length;
            }
            return null;
        };

        const animate = () => {
            if (cancelledRef.current) {
                setIsAnimating(false);
                return;
            }
            
            frame++;
            const progress = Math.min(frame / totalFrames, 1);
            const easedProgress = easeInOutCubic(progress);

            const lookupSpeed = Math.min(totalChars, Math.floor(lookupInitialSpeed * (.5 + easedProgress * 1.5)));
            const fixerSpeed = Math.min(totalChars, Math.floor(fixerInitialSpeed * (.5 + easedProgress * 1.5)));

            // move pointers
            lookupPos = Math.min(lookupPos + lookupSpeed, totalChars);
            fixerPos = Math.min(fixerPos + fixerSpeed, totalChars);

            // lookup pass: leave some chars behind
            for (let i = Math.max(0, lookupPos - lookupSpeed); i < lookupPos; i++) {
                const pos = getCharAt(i);
                if (pos && workingLines[pos.row][pos.col] !== ' ' && lines[pos.row][pos.col] !== '\n') {
                    if (Math.random() > leaveChance) {
                        workingLines[pos.row][pos.col] = ' ';
                    }
                }
            }

            // fixer pass: turn everything into spaces
            for (let i = Math.max(0, fixerPos - fixerSpeed); i < fixerPos; i++) {
                const pos = getCharAt(i);
                if (pos) {
                    workingLines[pos.row][pos.col] = ' ';
                }
            }

            setDisplayContent(flatten2D(workingLines));

            // Trigger halfway callback
            if (!halfwayTriggered && fixerPos >= totalChars / 2 && onHalfway) {
                halfwayTriggered = true;
                onHalfway();
            }

            if (fixerPos < totalChars) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // ensure all are spaces
                setTimeout(() => {
                    setDisplayContent('');
                    setIsAnimating(false);
                  }, 100);          
            }
        };
        
        animate();
    };

    const cancel = () => {
        cancelledRef.current = true;
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setIsAnimating(false);
      };    

    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);

    return { displayContent, appear, dissolve, isAnimating, cancel };    
};

export default useShuffleEffect;