'use client';

import { useState, useRef } from 'react';
import ShuffleText, { ShuffleTextRef } from '@/components/ShuffleText';

const Home = () => {
  const [section, setSection] = useState<'about' | 'projects' | 'home'>("home");
  
  const mainContentRef = useRef<ShuffleTextRef>(null);
  const titleRef = useRef<ShuffleTextRef>(null);
  const homeRef = useRef<ShuffleTextRef>(null);
  const aboutRef = useRef<ShuffleTextRef>(null);
  const projectsRef = useRef<ShuffleTextRef>(null);

  const titleContent = {
    home: "Hi, I'm Zihan",
    about: "about me",
    projects: "projects"
  };
  
  const bodyContent = {
    home: `Electrical & Coomputer Engineering | Cooper Union
Information will be updated soon. For now, here's a portion of the Bee Movie script with a terminal shuffle effect.

According to all known laws of aviation, there is no way a bee should be able to fly.
Its wings are too small to get its fat little body off the ground.
The bee, of course, flies anyway because bees don't care what humans think is impossible.
Yellow, black. Yellow, black. Yellow, black. Yellow, black.
Ooh, black and yellow!
Let's shake it up a little.
Barry! Breakfast is ready!
Coming!
Hang on a second.
Hello?
Barry?
Adam?
Can you believe this is happening?
I can't.
I'll pick you up.
Looking sharp.
Use the stairs, Your father paid good money for those.
Sorry. I'm excited.
Here's the graduate.
We're very proud of you, son.
A perfect report card, all B's.
Very proud.
Ma! I got a thing going here.
You got lint on your fuzz.
Ow! That's me!
Wave to us! We'll be in row 118,000.
Bye!
`.trim(),
    
    about: `I like making things.`.trim(),
    
    projects: `W.I.P.`.trim()
  };

  function contentChange(newSection: 'about' | 'projects' | 'home') {
    if (newSection === section) return;
    
    setSection(newSection);
    mainContentRef.current?.transition(bodyContent[newSection]);
    titleRef.current?.transition(titleContent[newSection]);
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 flex flex-col justify-center items-end pr-[2vw] border-[#282A36]">
        <button className="py-[1vw] px-[1vw]" onClick={() => contentChange('about')}>
          <span
            className={`
              p-[0.2vw]
              text-[#f24bbb]
              hover:bg-[#f24bbb] hover:text-[#1A1A1A]
              ${section === 'about' ? 'underline decoration-current underline-offset-[0.4vw]' : ''}
            `}
          >
            [about me]
          </span>
        </button>
        
        <button className="py-[1vw] px-[1vw]" onClick={() => contentChange('projects')}>
          <span
            className={`
              p-[0.2vw] 
              text-[#32A956] 
              hover:bg-[#32A956] hover:text-[#1A1A1A]
              ${section === 'projects' ? 'underline decoration-current underline-offset-[0.4vw]' : ''}
            `}
          >
            [projects]
          </span>
        </button>
        
        <button
          className={`py-[1vw] px-[1vw] ${section === 'home' ? 'pointer-events-none' : ''}`}
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
      <div className="flex-1 min-h-0 overflow-y-auto pt-[4vw] pl-[8vw] pr-[4vw]">
        {/* Title Section */}
        <div style={{minHeight: '8vw'}}>
          <ShuffleText 
            ref={titleRef}
            className="font-title text-title pb-[5vw]"
          >
            {titleContent[section]}
          </ShuffleText>
        </div>


        {/* Body Section */}
        <ShuffleText 
          ref={mainContentRef}
          className="font-mono text-base"
        >
          {bodyContent[section]}
        </ShuffleText>
      </div>
    </div>
  );
};

export default Home;