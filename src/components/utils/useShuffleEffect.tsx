'use client';
import { useState, useEffect, useRef } from 'react';

const SYMBOLS = "!@#$%^&*()_+x.,/<>?;:[]{}|-=";
const BASE_INTERVAL = 1000 / 60;

// cubic ease-in-out
const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

type ShuffleTextOptions = {
    duration?: number;
    lookupInitialSpeed?: number;
    fixerInitialSpeed?: number;
    scrambleChance?: number;
    leaveChance?: number;
    scrambleChangeChance?: number;
};

// sliding window shuffle effect (time-based)
const useShuffleEffect = (content: string, options: ShuffleTextOptions = {}) => {
    const {
        duration: durationOverride,
        lookupInitialSpeed = 4,
        fixerInitialSpeed = 2,
        scrambleChance = 0.05,
        leaveChance = 0.10,
        scrambleChangeChance = 0.05
    } = options;

    // scale duration with text length (~1ms/char, 300ms floor)
    const duration_scale = 1.1;
    const duration = durationOverride ?? Math.max(content.length * duration_scale, 300);

    const [displayContent, setDisplayContent] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef<number | null>(null);
    const cancelledRef = useRef(false);

    const contentTo2D = (text: string) => {
        return text.split('\n').map(line => line.split(''));
    };

    const flatten2D = (arr: string[][]) => {
        return arr.map(line => line.join('')).join('\n');
    };

    const getCharAt = (pos: number, lines: string[][]) => {
        let count = 0;
        for (let i = 0; i < lines.length; i++) {
            if (count + lines[i].length > pos) {
                return { row: i, col: pos - count };
            }
            count += lines[i].length;
        }
        return null;
    };

    const appear = () => {
        cancelledRef.current = false;
        setIsAnimating(true);

        const lines = contentTo2D(content);
        const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
        const workingLines = lines.map(line => line.map(() => ' '));
        const speedRatio = lookupInitialSpeed / fixerInitialSpeed;

        // normalize base speed so fixer completes in ~duration ms
        // average of (0.5 + easing * 1.5) over [0,1] = 1.25 for symmetric ease
        const baseSpeed = totalChars * BASE_INTERVAL / (1.25 * duration);

        let lookupPos = 0;
        let fixerPos = 0;
        let lastTime: number | null = null;
        let startTime = 0;

        const animate = (now: number) => {
            if (cancelledRef.current) {
                setIsAnimating(false);
                return;
            }

            // skip first frame to establish timing
            if (lastTime === null) {
                lastTime = now;
                startTime = now;
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            const dt = now - lastTime;
            lastTime = now;
            const dtScale = dt / BASE_INTERVAL;

            // easing modulates speed, not position
            const timeProgress = Math.min((now - startTime) / duration, 1);
            const speedMult = 0.5 + easeInOutCubic(timeProgress) * 1.5;

            const prevLookup = Math.floor(lookupPos);
            const prevFixer = Math.floor(fixerPos);

            lookupPos = Math.min(lookupPos + baseSpeed * speedRatio * speedMult * dtScale, totalChars);
            fixerPos = Math.min(fixerPos + baseSpeed * speedMult * dtScale, totalChars);

            const curLookup = Math.floor(lookupPos);
            const curFixer = Math.floor(fixerPos);

            // scale probabilities for frame-rate independence
            const scaledChangeChance = 1 - Math.pow(1 - scrambleChangeChance, dtScale);
            const scaledScrambleChance = 1 - Math.pow(1 - scrambleChance, dtScale);

            // lookup pass: scramble new characters
            for (let i = prevLookup; i < curLookup; i++) {
                const pos = getCharAt(i, lines);
                if (pos && lines[pos.row][pos.col] !== ' ' && lines[pos.row][pos.col] !== '\n') {
                    if (Math.random() < scrambleChance) {
                        workingLines[pos.row][pos.col] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    }
                }
            }

            // update existing scrambled chars between fixer and lookup
            for (let i = curFixer; i < curLookup; i++) {
                const pos = getCharAt(i, lines);
                if (pos) {
                    const char = workingLines[pos.row][pos.col];
                    if (SYMBOLS.includes(char) && Math.random() < scaledChangeChance) {
                        workingLines[pos.row][pos.col] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    }
                    if (char === ' ' && lines[pos.row][pos.col] !== ' ' && lines[pos.row][pos.col] !== '\n' && Math.random() < scaledScrambleChance) {
                        workingLines[pos.row][pos.col] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                    }
                }
            }

            // fixer pass: resolve characters to final content
            for (let i = prevFixer; i < curFixer; i++) {
                const pos = getCharAt(i, lines);
                if (pos) {
                    workingLines[pos.row][pos.col] = lines[pos.row][pos.col];
                }
            }

            setDisplayContent(flatten2D(workingLines));

            if (curFixer < totalChars) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                for (let i = 0; i < lines.length; i++) {
                    for (let j = 0; j < lines[i].length; j++) {
                        workingLines[i][j] = lines[i][j];
                    }
                }
                setDisplayContent(flatten2D(workingLines));
                setIsAnimating(false);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    const dissolve = (onHalfway?: () => void) => {
        cancelledRef.current = false;
        setIsAnimating(true);

        const lines = contentTo2D(content);
        const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
        const workingLines = contentTo2D(content);
        const speedRatio = lookupInitialSpeed / fixerInitialSpeed;
        const baseSpeed = totalChars * BASE_INTERVAL / (1.25 * duration);

        let lookupPos = 0;
        let fixerPos = 0;
        let lastTime: number | null = null;
        let startTime = 0;
        let halfwayTriggered = false;

        const animate = (now: number) => {
            if (cancelledRef.current) {
                setIsAnimating(false);
                return;
            }

            if (lastTime === null) {
                lastTime = now;
                startTime = now;
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            const dt = now - lastTime;
            lastTime = now;
            const dtScale = dt / BASE_INTERVAL;

            const timeProgress = Math.min((now - startTime) / duration, 1);
            const speedMult = 0.5 + easeInOutCubic(timeProgress) * 1.5;

            const prevLookup = Math.floor(lookupPos);
            const prevFixer = Math.floor(fixerPos);

            lookupPos = Math.min(lookupPos + baseSpeed * speedRatio * speedMult * dtScale, totalChars);
            fixerPos = Math.min(fixerPos + baseSpeed * speedMult * dtScale, totalChars);

            const curLookup = Math.floor(lookupPos);
            const curFixer = Math.floor(fixerPos);

            // lookup pass: leave some chars behind
            for (let i = prevLookup; i < curLookup; i++) {
                const pos = getCharAt(i, lines);
                if (pos && workingLines[pos.row][pos.col] !== ' ' && lines[pos.row][pos.col] !== '\n') {
                    if (Math.random() > leaveChance) {
                        workingLines[pos.row][pos.col] = ' ';
                    }
                }
            }

            // fixer pass: clear everything
            for (let i = prevFixer; i < curFixer; i++) {
                const pos = getCharAt(i, lines);
                if (pos && lines[pos.row][pos.col] !== '\n') {
                    workingLines[pos.row][pos.col] = ' ';
                }
            }

            setDisplayContent(flatten2D(workingLines));

            if (!halfwayTriggered && curFixer >= totalChars / 2 && onHalfway) {
                halfwayTriggered = true;
                onHalfway();
            }

            if (curFixer < totalChars) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    setDisplayContent('');
                    setIsAnimating(false);
                }, 100);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
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
