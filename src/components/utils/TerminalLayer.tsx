import { useEffect, useRef } from 'react';
import useShuffleEffect from './useShuffleEffect';

interface TerminalLayerProps {
    content: string;
    className?: string;
    lookupInitialSpeed?: number;
    fixerInitialSpeed?: number;
    onMount: (methods: any) => void;
    isInitial?: boolean;
    autoAppear?: boolean;
}

export const TerminalLayer = ({ 
    content, 
    className = '', 
    lookupInitialSpeed = 30, 
    fixerInitialSpeed = 15, 
    onMount, 
    isInitial = false,
    autoAppear = false
}: TerminalLayerProps) => {
    const { displayContent, appear, dissolve, isAnimating, cancel } = useShuffleEffect(content, {
        lookupInitialSpeed,
        fixerInitialSpeed
    });
  
    const hasStarted = useRef(false);
    const isMounted = useRef(true);
    const methodsRef = useRef({ appear, dissolve, isAnimating, cancel });

    useEffect(() => {
        methodsRef.current = { appear, dissolve, isAnimating, cancel };
    }, [appear, dissolve, isAnimating, cancel]);

    useEffect(() => {
        isMounted.current = true;
        onMount(methodsRef.current);

        if ((isInitial || autoAppear) && !hasStarted.current) {
            hasStarted.current = true;
            setTimeout(() => {
                if (isMounted.current) {
                    methodsRef.current.appear();
                }
            }, 100);
        } else {
            console.log('NOT starting appear - isInitial:', isInitial, 'autoAppear:', autoAppear, 'hasStarted:', hasStarted.current);
        }

        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <div 
            className={`absolute top-0 left-0 w-full h-full ${className}`}
                style={{ 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'monospace',
                overflow: 'hidden'
                }}
        >
            {displayContent}
        </div>
    );
};  