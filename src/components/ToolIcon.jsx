import React from 'react';
import { 
  SiArduino, SiJavascript, SiTypescript, SiPython, SiReact, 
  SiNextdotjs, SiTailwindcss, SiVuedotjs, SiNodedotjs, SiPostgresql, 
  SiDocker, SiUbuntu, SiHtml5, SiCss,
  SiFigma, SiFirebase, SiSupabase, SiMongodb, SiCplusplus,
  SiPytorch, SiOpencv, SiHuggingface, SiGooglegemini, SiEspressif, 
  SiDeepseek, SiAnthropic
} from 'react-icons/si';
import { 
  FaRobot, FaNetworkWired, FaShieldAlt, FaTerminal, FaServer, 
  FaLaptopCode, FaDatabase, FaPaintBrush, FaGlobe, FaBrain, FaLock,
  FaCode, FaMicrochip, FaAws, FaProjectDiagram, FaGithub, FaLinkedin,
  FaWifi, FaBluetooth, FaSpaceShuttle
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
  'pytorch': SiPytorch,
  'opencv': SiOpencv,
  
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
  'vscode': FaCode, 'vs code': FaCode, 'visual studio code': FaCode,
  'arduino': SiArduino, 'arunio': SiArduino, // typo catching
  'esp32': SiEspressif, 'espressif': SiEspressif,
  'n8n': FaProjectDiagram, 'n8n workflow': FaProjectDiagram, 'n8n worflow': FaProjectDiagram,
  'wifi': FaWifi, 'wi-fi': FaWifi,
  'bluetooth': FaBluetooth,
  
  // AI & Machine Learning
  'deepseek': SiDeepseek,
  'gemini': SiGooglegemini, 'google gemini': SiGooglegemini,
  'huggingface': SiHuggingface, 'hugging face': SiHuggingface,
  'anthropic': SiAnthropic, 'claude': SiAnthropic,
  'openai': FaBrain, 'chatgpt': FaBrain,
  
  // Miscellaneous
  'antigravity': FaSpaceShuttle, 'anitgravity': FaSpaceShuttle,
  
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
