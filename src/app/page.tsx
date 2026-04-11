'use client';

import { useState, useRef } from 'react';
import ShuffleText, { ShuffleTextRef } from '@/components/ShuffleText';
import CommitLog from '@/components/CommitLog';
import ProjectList, { ProjectListRef } from '@/components/ProjectList';
import { getProjectContent } from '@/components/ProjectDetail';
import { ProjectData } from '@/data/projects';

const Home = () => {
  const [section, setSection] = useState<'about' | 'projects' | 'home'>("home");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const mainContentRef = useRef<ShuffleTextRef>(null);
  const homeRef = useRef<ShuffleTextRef>(null);
  const aboutRef = useRef<ShuffleTextRef>(null);
  const projectsRef = useRef<ShuffleTextRef>(null);
  const projectListRef = useRef<ProjectListRef>(null);

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
          <div key="subTitle" className="pb-[2vw]">
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
          <div key="subTitle" className="pb-[2vw]">
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
          <div key="subTitle" className="pb-[2vw]">
          Select a project to learn more.
          </div>
        </>
      );
    }

    return null;
  }

  function handleProjectSelect(project: ProjectData) {
    if (selectedProject?.id === project.id) return;
    setSelectedProject(project);
    mainContentRef.current?.transition(getProjectContent(project));
  }

  function contentChange(newSection: 'about' | 'projects' | 'home') {
    if (newSection === section) return;

    if (section === 'projects' && newSection !== 'projects') {
      projectListRef.current?.shuffleOut();
    }

    setSection(newSection);
    setSelectedProject(null);

    // trigger transition with full content structure
    mainContentRef.current?.transition(getFullContent(newSection));

    if (newSection === 'projects') {
      setTimeout(() => projectListRef.current?.shuffleIn(), 150);
    }

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
      <div className="fixed bottom-0 right-0 p-[1vw] z-10">
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
              hover:bg-[#f24bbb] hover:text-[#1A1A1A]
              ${section === 'about' ? 'bg-[#f24bbb] text-[#1A1A1A]' : 'text-[#f24bbb]'}
            `}
          >
            [about me]
          </span>
        </button>
        
        <button className="py-[1vw] px-[1vw]" onClick={() => contentChange('projects')}>
          <span
            className={`
              p-[0.2vw]
              hover:bg-[#63FA88] hover:text-[#1A1A1A]
              ${section === 'projects' ? 'bg-[#63FA88] text-[#1A1A1A]' : 'text-[#63FA88]'}
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
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pt-[2.8vw] pl-[8vw] pr-[4vw]">
        <ShuffleText ref={mainContentRef}>
          {getFullContent(section)}
        </ShuffleText>
      </div>

      {/* Project List */}
      <div className="w-1/4 flex flex-col justify-start overflow-y-auto no-scrollbar pt-[4vw]">
        <ProjectList
          ref={projectListRef}
          selectedId={selectedProject?.id ?? null}
          onSelect={handleProjectSelect}
        />
      </div>
    </div>
  );
};

export default Home;