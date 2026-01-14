'use client';

import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { TerminalLayer } from './utils/TerminalLayer';

interface ShuffleTextProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    lookupInitialSpeed?: number;
    fixerInitialSpeed?: number;
}

export interface ShuffleTextRef {
    appear: () => void;
    dissolve: () => void;
    transition: (newContent: React.ReactNode) => void;
}

const ShuffleText = forwardRef<any, ShuffleTextProps>(({
    children,
    className = '',
    style = {},
    lookupInitialSpeed = 30,
    fixerInitialSpeed = 15
}, ref) => {
    const [layers, setLayers] = useState([{ id: 0, content: children}]);
    const [activeLayerId, setActiveLayerId] = useState(0);
    const effectRefs = useRef<any>({});
    const nextIdRef = useRef(1);
    const currentContent = useRef(children);

    useImperativeHandle(ref, () => ({
        appear: () => {
            const layer = layers.find(l => l.id  === activeLayerId);
            if (layer && effectRefs.current[layer.id]) {
                effectRefs.current[layer.id].appear();
            }
        },
        dissolve: () => {
            const layer = layers.find(l => l.id  === activeLayerId);
            if (layer && effectRefs.current[layer.id]) {
                effectRefs.current[layer.id].dissolve();
            }
        },
        transition: (newContent: React.ReactNode) => {
            const oldLayerId = activeLayerId;
            const newLayerId = nextIdRef.current++;

            Object.keys(effectRefs.current).forEach(layerId => {
                const id = parseInt(layerId);
                if (id !== oldLayerId && effectRefs.current[id] && effectRefs.current[id].cancel) {
                    effectRefs.current[id].cancel();
                }
            });

            setLayers(prev => {
                const currentLayer = prev.find(l => l.id === oldLayerId);
                return currentLayer ? [currentLayer] : [{ id: oldLayerId, content: currentContent.current }];            
            });

            if (effectRefs.current[oldLayerId]) {
                effectRefs.current[oldLayerId].dissolve(() => {
                    setLayers(prev => {
                        const oldLayer = prev.find(l => l.id === oldLayerId);
                        return oldLayer ? [oldLayer, { id: newLayerId, content: newContent }] : [{ id: newLayerId, content: newContent }];
                    });
                    setActiveLayerId(newLayerId);
                });
            } else {
                setLayers([{ id: newLayerId, content: newContent }]);
                setActiveLayerId(newLayerId);
            }

            setTimeout(() => {
                setLayers(prev => prev.filter(l => l.id === newLayerId || l.id > newLayerId));
                Object.keys(effectRefs.current).forEach(layerId => {
                    const id = parseInt(layerId);
                    if (id !== newLayerId && id < newLayerId) {
                        delete effectRefs.current[id];
                    }
                });
            }, 2000);
            currentContent.current = newContent;
        }
    }));

    return (
        <div className="relative w-full h-full" style={{...style}}>
            {layers.map((layer) => (
                <TerminalLayer
                    key={layer.id}
                    className={className}
                    lookupInitialSpeed={lookupInitialSpeed}
                    fixerInitialSpeed={fixerInitialSpeed}
                    isInitial={layer.id === 0}
                    autoAppear={layer.id !== 0}
                    onMount={(methods) => {
                        effectRefs.current[layer.id] = methods;
                    }}            
                >
                    {layer.content}
                </TerminalLayer>
            ))}
        </div>
    );
});

ShuffleText.displayName = 'ShuffleText';

export default ShuffleText;