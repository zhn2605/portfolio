import React, { useEffect, useRef } from 'react';
import useShuffleEffect from './useShuffleEffect';

interface TerminalLayerProps {
    children: React.ReactNode;
    className?: string;
    lookupInitialSpeed?: number;
    fixerInitialSpeed?: number;
    onMount: (methods: any) => void;
    isInitial?: boolean;
    autoAppear?: boolean;
}

// extract text content from ReactNode
const extractText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (React.isValidElement(node)) {
    const props = node.props as any;
    return extractText(props.children);
  }
  return '';
};

// apply effect to ReactNode structure
const applyShuffledText = (node: React.ReactNode, shuffledText: string, indexRef: { current: number }): React.ReactNode => {
  if (typeof node === 'string') {
    const length = node.length;
    const result = shuffledText.slice(indexRef.current, indexRef.current + length);
    indexRef.current += length;
    return result;
  }
  
  if (typeof node === 'number') {
    const str = String(node);
    const length = str.length;
    const result = shuffledText.slice(indexRef.current, indexRef.current + length);
    indexRef.current += length;
    return result;
  }
  
  if (Array.isArray(node)) {
    return node.map((child, index) => {
      const processed = applyShuffledText(child, shuffledText, indexRef);
      // wrap in fragment if its not already a valid React element with a key
      if (React.isValidElement(processed) && processed.key != null) {
        return processed;
      }
      return <React.Fragment key={index}>{processed}</React.Fragment>;
    });
  }
  
  if (React.isValidElement(node)) {
    const props = node.props as any;
    const children = applyShuffledText(props.children, shuffledText, indexRef);
    return React.cloneElement(node, { key: node.key }, children);
  }
  
  return node;
};

export const TerminalLayer = ({ 
    children, 
    className = '', 
    lookupInitialSpeed = 50, 
    fixerInitialSpeed = 25, 
    onMount, 
    isInitial = false,
    autoAppear = false
}: TerminalLayerProps) => {
    const content = extractText(children);
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
        }

        return () => {
            isMounted.current = false;
        };
    }, []);

    const renderedContent = applyShuffledText(children, displayContent, { current: 0 });

    return (
        <div 
            className={`absolute top-0 left-0 w-full h-full ${className}`}
            style={{ 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'monospace',
            }}
        >
            {renderedContent}
        </div>
    );
};