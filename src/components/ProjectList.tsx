'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ShuffleText, { ShuffleTextRef } from '@/components/ShuffleText';
import { projects, ProjectData } from '@/data/projects';

export interface ProjectListRef {
  shuffleIn: () => void;
  shuffleOut: () => void;
}

interface ProjectListProps {
  selectedId: string | null;
  onSelect: (project: ProjectData) => void;
}

const ProjectList = forwardRef<ProjectListRef, ProjectListProps>(({ selectedId, onSelect }, ref) => {
  const shuffleRef = useRef<ShuffleTextRef>(null);
  const hasShuffled = useRef(false);
  const [active, setActive] = useState(false);

  useImperativeHandle(ref, () => ({
    shuffleIn: () => {
      if (!hasShuffled.current) {
        hasShuffled.current = true;
        setActive(true);
        shuffleRef.current?.appear();
      }
    },
    shuffleOut: () => {
      hasShuffled.current = false;
      setActive(false);
      shuffleRef.current?.dissolve();
    },
  }));

  return (
    <div className="relative">
      {/* Shuffle effect layer — text only, no interaction */}
      <div className="pointer-events-none">
        <ShuffleText ref={shuffleRef} autoStart={false}>
          W.I.P.
          <ul key="project-list" className="link-list">
            {projects.map((project) => (
              <li key={project.id}>
                <span className="text-[#63FA88]">{project.name}</span>
              </li>
            ))}
          </ul>
        </ShuffleText>
      </div>

      {/* Interactive layer — handles highlight and clicks */}
      <div className={`absolute top-0 left-0 w-full h-full ${active ? '' : 'pointer-events-none invisible'}`}>
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            <span className="invisible">W.I.P.</span>
            <ul className="link-list">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    className={`pd-[0.2vw] text-left ${
                      selectedId === project.id
                        ? 'bg-[#63FA88] text-[#1A1A1A] cursor-default'
                        : 'text-transparent hover:bg-[#63FA88] hover:text-[#1A1A1A]'
                    }`}
                    onClick={() => selectedId !== project.id && onSelect(project)}
                  >
                    {project.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectList.displayName = 'ProjectList';

export default ProjectList;
