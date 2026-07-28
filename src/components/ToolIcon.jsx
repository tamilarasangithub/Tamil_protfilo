import React from 'react';
import { 
  SiArduino, SiJavascript, SiTypescript, SiPython, SiReact, 
  SiNextdotjs, SiTailwindcss, SiVuedotjs, SiNodedotjs, SiPostgresql, 
  SiDocker, SiUbuntu, SiHtml5, SiCss,
  SiFigma, SiFirebase, SiSupabase, SiMongodb, SiCplusplus
} from 'react-icons/si';
import { 
  FaRobot, FaNetworkWired, FaShieldAlt, FaTerminal, FaServer, 
  FaLaptopCode, FaDatabase, FaPaintBrush, FaGlobe, FaBrain, FaLock,
  FaCode, FaMicrochip, FaAws, FaProjectDiagram, FaGithub, FaLinkedin
} from 'react-icons/fa';

const iconMap = {
  // Languages & Core
  'html': SiHtml5, 'html5': SiHtml5,
  'css': SiCss, 'css3': SiCss,
  'js': SiJavascript, 'javascript': SiJavascript,
  'ts': SiTypescript, 'typescript': SiTypescript,
  'python': SiPython, 
  'java': FaCode, 
  'c++': SiCplusplus, 'cpp': SiCplusplus,
  'c#': FaCode, 'csharp': FaCode,
  
  // Frameworks & Libs
  'react': SiReact, 'reactjs': SiReact,
  'nextjs': SiNextdotjs, 'next.js': SiNextdotjs,
  'tailwind': SiTailwindcss, 'tailwindcss': SiTailwindcss,
  'vue': SiVuedotjs, 'vuejs': SiVuedotjs,
  'node': SiNodedotjs, 'nodejs': SiNodedotjs,
  
  // Databases & Infrastructure & Tools
  'postgres': SiPostgresql, 'postgresql': SiPostgresql,
  'mongo': SiMongodb, 'mongodb': SiMongodb,
  'firebase': SiFirebase,
  'supabase': SiSupabase,
  'aws': FaAws, 'amazon web services': FaAws,
  'github': FaGithub,
  'linkedin': FaLinkedin,
  'docker': SiDocker,
  'ubuntu': SiUbuntu,
  'figma': SiFigma,
  'arduino': SiArduino, 'arunio': SiArduino, // typo catching
  'n8n': FaProjectDiagram, 'n8n workflow': FaProjectDiagram, 'n8n worflow': FaProjectDiagram,
  
  // Generic IT terms
  'ui&ux': FaPaintBrush, 'ui/ux': FaPaintBrush, 'ui': FaPaintBrush, 'ux': FaPaintBrush, 'design': FaPaintBrush,
  'web development': FaGlobe, 'web': FaGlobe, 'web dev': FaGlobe,
  'devops': FaNetworkWired,
  'backend': FaServer, 'back-end': FaServer,
  'frontend': FaLaptopCode, 'front-end': FaLaptopCode,
  'ai&ml': FaBrain, 'ai & ml': FaBrain, 'ai': FaBrain, 'ml': FaBrain, 'machine learning': FaBrain, 'artificial intelligence': FaBrain,
  'ai agent': FaRobot, 'bot': FaRobot,
  'iot': FaMicrochip, 'internet of things': FaMicrochip,
  'cybersecurity': FaShieldAlt, 'security': FaShieldAlt, 'cyber security': FaShieldAlt,
  'pen tester': FaTerminal, 'penetration testing': FaTerminal, 'ethical hacking': FaTerminal,
  'database': FaDatabase
};

export default function ToolIcon({ name, className, size = 24, style }) {
  const cleanName = name.trim().toLowerCase();
  
  // Try to find exact match
  let IconComponent = iconMap[cleanName];
  
  // If no exact match, try to find partial match
  if (!IconComponent) {
    for (const [key, icon] of Object.entries(iconMap)) {
      if (cleanName.includes(key)) {
        IconComponent = icon;
        break;
      }
    }
  }
  
  // Fallback to a generic code icon
  if (!IconComponent) {
    IconComponent = FaCode;
  }

  return <IconComponent className={className} size={size} style={style} title={name.trim()} />;
}
