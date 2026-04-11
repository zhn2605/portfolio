export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  media?: { type: 'image' | 'video'; src: string };
  links?: ProjectLink[];
  tags?: string[];
}

export const projects: ProjectData[] = [
  {
    id: 'nos',
    name: 'non-operating-system',
    description: 'A hobby 64bit OS project written in Rust + C.',
    links: [{ label: 'github', url: 'https://github.com/zhn2605/non-operating-system' }],
  },
  {
    id: 'sf',
    name: 'swedish_fish',
    description: 'SPH fluid simulation using OpenGL and SDL3.',
    links: [{ label: 'github', url: 'https://github.com/zhn2605/swedish_fish' }],
  },
  {
    id: 'ppv',
    name: 'pure-pursuit-visualizer',
    description: 'A visualizer for the pure pursuit algorithm using matplotlib and numpy.',
    links: [{ label: 'github', url: 'https://github.com/zhn2605/pure-pursuit-visualizer' }],
  },
  {
    id: 'cou',
    name: 'congenial-octo-umbrella',
    description: 'Submission for DevFest 2026. Generative chess game where unique pieces and pixel art representation are generated every match.',
    links: [
      { label: 'github', url: 'https://github.com/alias1233/congenial-octo-umbrella'},
      { label: 'devpost', url: 'https://devpost.com/software/i-forgot-il1xpu' },
    ],
  },
  {
    id: 'ss',
    name: 'sheet-sharp',
    description: 'Musical code? Coding music? Written in Rodio.',
    links: [{ label: 'github', url: 'https://github.com/zhn2605/sheet-sharp' }],
  },
];
