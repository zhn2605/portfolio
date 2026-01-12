'use client'

import { useState } from 'react';

const Home = () => (
  <div className="flex h-screen">
    {/* Sidebar */}
    <div className="w-1/5 flex flex-col justify-center border-r-2 items-end pr-[2vw] border-[#282A36]">
      {/* About Me*/}
      <button className="py-[1vw] px-[1vw]">
        <span className="p-[0.2vw] hover:bg-[#f24bbb] hover:text-[#222024] text-[#f24bbb]">
          [about me]
        </span>
      </button>
      
      {/* Projects */}
      <button className="py-[1vw] px-[1vw]">
        <span className="p-[0.2vw] hover:bg-[#32A956] hover:text-[#222024] text-[#32A956]">
          [projects]
        </span>
      </button>
    </div>
    
    {/* Main Content */}
    <div className="flex-1 p-8 pl-24">
      <h1 className="font-title text-title">Hi, I'm Zihan</h1>
      <p>
        Here's a bunch of jargon set up to test out terminal dissolve effect.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  </div>
);

export default Home;
