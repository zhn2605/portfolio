import { ProjectData } from '@/data/projects';

export function getProjectContent(project: ProjectData) {
  return (
    <>
      <div key="title" className="font-title text-title">
        {project.name}
      </div>
      {project.media ? (
        <div key="media" className="w-full pb-[2vw]">
          {project.media.type === 'image' && (
            <img src={project.media.src} alt={project.name} className="w-full object-cover" />
          )}
          {project.media.type === 'video' && (
            <video src={project.media.src} controls className="w-full" />
          )}
        </div>
      ) : (
        <div key="media" className="w-full pb-[2vw] text-[#6B6B6B]">
          $ cat ./media/{project.id} — no such file or directory
        </div>
      )}
      <div key="description" className="pb-[2vw]">
        {project.description}
      </div>
      {project.links && project.links.length > 0 && (
        <ul key="links" className="link-list">
          {project.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-[0.2vw] text-[#68a6af] hover:bg-[#68a6af] hover:text-[#1A1A1A]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
