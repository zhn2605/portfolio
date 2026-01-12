'use client'

import { useState } from 'react';
import ShuffleTest from '@/utils/shuffle';

const Home = () => {
  const [section, setSection] = useState<'about' | 'projects' | 'home'>("home");

  function contentChange(section: 'about' | 'projects' | 'home') {
    setSection(section);
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 flex flex-col justify-center border-r-[0.1vw] items-end pr-[2vw] border-[#282A36]">
        {/* About Me*/}
        <button className="py-[1vw] px-[1vw]" onClick={() => contentChange('about')}>
          <span
            className={`
              p-[0.2vw]
              text-[#f24bbb]
              hover:bg-[#f24bbb] hover:text-[#1A1A1A]
              ${section === 'about' ? 'underline decoration-current underline-offset-8' : ''}
            `}
          >
            [about me]
          </span>
        </button>

        {/* Projects */}
        <button className="py-[1vw] px-[1vw]" onClick={() => contentChange('projects')}>
          <span
            className={`
              p-[0.2vw] 
              text-[#32A956] 
              hover:bg-[#32A956] hover:text-[#1A1A1A]
              ${section === 'projects' ? 'underline decoration-current underline-offset-8' : ''}
              `}
          >
            [projects]
          </span>
        </button>

        {/* Back/home */}
        <button
          className={`
            py-[1vw] px-[1vw]
            ${section === 'home' ? 'pointer-events-none' : ''}
          `}
          onClick={() => contentChange('home')}
        >
          <span
            className={`
              p-[0.2vw]
              text-[#6B6B6B]
              hover:bg-[#6B6B6B] hover:text-[#1A1A1A]
              ${section === 'home' ? 'opacity-0' : 'opacity-100'}
            `}
          >
            [back]
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-[4vw] pl-[8vw] pr-[4vw]">
        {section === 'home' && (
          <>
            <h1 className="font-title text-title pb-[4vw]">Hi, I'm Zihan</h1>
            <p>Here's a bunch of jargon set up to test out terminal dissolve effect.</p>
          </>
        )}

        {section === 'about' && (
          <>
            <h1 className="font-title text-title pb-[4vw]">about me</h1>
            <p>.asdasdad</p>
          </>
        )}

        {section === 'projects' && (
          <>
            <h1 className="font-title text-title pb-[4vw]">projects</h1>
            <p>Cool things live here.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
