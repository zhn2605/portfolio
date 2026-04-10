'use client';

import { useState, useRef } from 'react';
import ShuffleText, { ShuffleTextRef } from '@/components/ShuffleText';
import CommitLog from '@/components/CommitLog';

const Home = () => {
  const [section, setSection] = useState<'about' | 'projects' | 'home'>("home");
  
  const mainContentRef = useRef<ShuffleTextRef>(null);
  const homeRef = useRef<ShuffleTextRef>(null);
  const aboutRef = useRef<ShuffleTextRef>(null);
  const projectsRef = useRef<ShuffleTextRef>(null);

  const bodyContent = {
    home: `More information will be updated soon.
Click 'about me' for contacts and 'projects' to check out some things I've made.`.trim(),
    about: `Here's how to contact me:`.trim(),
    
    projects: `W.I.P.`.trim()
  };

  const getFullContent = (sectionName: 'about' | 'projects' | 'home') => {
    if (sectionName === 'home') {
      return (
        <>
          <div key="title" className="font-title text-title">
            Hi, I'm <span className="text-[#FFB768]">Zihan</span>
          </div>
          <div key="subTitle" className="pb-[3vw]">
          Electrical & Computer Engineering | Cooper Union
          </div>
          <div key="body" className="overflow-y-auto no-scrollbar pb-[8vw]">
            {bodyContent.home}
          </div>
        </>
      );
    }
    
    if (sectionName === 'about') {
      return (
        <>
          <div key="title" className="font-title text-title">
            about me
          </div>
          <div key="subTitle" className="pb-[3vw]">
          I enjoy making things.
          </div>
          <span key="body">
            {bodyContent.about}
          </span>
          
          <ul key="list" className="link-list">
            <li key="github">
              <a className="pd-[0.2vw] text-[#f24bbb] hover:bg-[#f24bbb] hover:text-[#1A1A1A]" href="https://github.com/zhn2605">
              github
              </a>
            </li>
            <li key="email">
              <a className="pd-[0.2vw] text-[#f24bbb] hover:bg-[#f24bbb] hover:text-[#1A1A1A]" href="https://mail.google.com/mail/u/zihan.zhao2605@gmail.com/#inbox" target="_blank" rel="noopener noreferrer">
              email
              </a>
            </li>
            <li key="linked-in">
              <a className="pd-[0.2vw] text-[#f24bbb] hover:bg-[#f24bbb] hover:text-[#1A1A1A]" href="https://www.linkedin.com/in/zihan-zhao-1b19b8292/">
              linked in
              </a>
            </li>
          </ul>

        </>
      );
    }

    if (sectionName === 'projects') {
      return (
        <>
          <div key="title" className="font-title text-title">
            projects
          </div>
          <div key="subTitle" className="pb-[3vw]">
          Click on the links for more information.
          </div>
          <span key="body">
            {bodyContent.projects}
          </span>
          <ul key="list" className="link-list">
            <li key="nos-repo">
              <a className="pd-[0.2vw] text-[#32A956] hover:bg-[#32A956] hover:text-[#1A1A1A]" href="https://github.com/zhn2605/non-operating-system">
              non-operating-system
              </a>
            </li>
            <li key="sf-repo">
              <a className="pd-[0.2vw] text-[#32A956] hover:bg-[#32A956] hover:text-[#1A1A1A]" href="https://github.com/zhn2605/swedish_fish">
              swedish_fish
              </a>
            </li>
            <li key="ppv-repo">
              <a className="pd-[0.2vw] text-[#32A956] hover:bg-[#32A956] hover:text-[#1A1A1A]" href="https://github.com/zhn2605/pure-pursuit-visualizer">
              pure-pursuit-visualizer
              </a>
            </li>
            <li key="cou-repo">
              <a className="pd-[0.2vw] text-[#32A956] hover:bg-[#32A956] hover:text-[#1A1A1A]" href="https://github.com/alias1233/congenial-octo-umbrella">
              congenial-octo-umbrella
              </a>
            </li>
            <li key="ss-repo">
              <a className="pd-[0.2vw] text-[#32A956] hover:bg-[#32A956] hover:text-[#1A1A1A]" href="https://github.com/zhn2605/sheet-sharp">
              sheet-sharp
              </a>
            </li>
          </ul>
          
          {/* stuff */}
        </>
      );
    }

    return null;
  }

  function contentChange(newSection: 'about' | 'projects' | 'home') {
    if (newSection === section) return;
    setSection(newSection);

    // trigger transition with full content structure
    mainContentRef.current?.transition(getFullContent(newSection));

    // trigger button transitions
    if (newSection === 'home') {
      aboutRef.current?.transition('[about me]');
      projectsRef.current?.transition('[projects]');
      homeRef.current?.transition('');
    } else if (newSection === 'about') {
      aboutRef.current?.transition('[about me]');
      projectsRef.current?.transition('[projects]');
      homeRef.current?.transition('[back]');
    } else if (newSection === 'projects') {
      aboutRef.current?.transition('[about me]');
      projectsRef.current?.transition('[projects]');
      homeRef.current?.transition('[back]');
    }
  }

  return (
    <div className="flex h-screen">
      {/* Commit Log */}
      <div className="position: fixed bottom-0 right-0 flex p-[1vw] ">
        <span>
          <CommitLog repo="portfolio" />
        </span>
      </div>
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
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pt-[4vw] pl-[8vw] pr-[4vw]">
        {/* Title Section */}
        <ShuffleText 
            ref={mainContentRef}
        >
          {getFullContent(section)}
        </ShuffleText>
      </div>
    </div>
  );
};

export default Home;