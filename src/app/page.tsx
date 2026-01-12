'use client'

import { useState } from 'react';

const Home = () => {
  const [section, setSection] = useState<'about' | 'projects' | 'home'>("home");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 flex flex-col justify-center border-r-[0.1vw] items-end pr-[2vw] border-[#282A36]">
        {/* About Me*/}
        <button className="py-[1vw] px-[1vw]">
          <span className="p-[0.2vw] hover:bg-[#f24bbb] hover:text-[#1A1A1A] text-[#f24bbb]">
            [about me]
          </span>
        </button>

        {/* Projects */}
        <button className="py-[1vw] px-[1vw]">
          <span className="p-[0.2vw] hover:bg-[#32A956] hover:text-[#1A1A1A] text-[#32A956]">
            [projects]
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-[4vw]  pl-[8vw] pr-[4vw]">
        <div className="font-title text-title pb-[4vw]">Hi, I'm Zihan</div>
        <p>
          Here's a bunch of jargon set up to test out terminal dissolve effect.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
  
};

export default Home;
