import React from 'react';
import { 
  SiArduino, SiJavascript, SiTypescript, SiPython, SiReact, 
  SiNextdotjs, SiTailwindcss, SiVuedotjs, SiNodedotjs, SiPostgresql, 
  SiDocker, SiUbuntu, SiHtml5, SiCss,
  SiFigma, SiFirebase, SiSupabase, SiMongodb, SiCplusplus,
  SiPytorch, SiOpencv, SiHuggingface, SiGooglegemini, SiEspressif, 
  SiDeepseek, SiAnthropic,
  SiKalilinux, SiBurpsuite, SiMetasploit, SiWireshark, SiOwasp, 
  SiBootstrap, SiExpress, SiDjango, SiFastapi, SiFlask, SiSpringboot, SiPhp, 
  SiMysql, SiRedis, SiSqlite, SiGit, SiVercel, SiNetlify, SiNginx, 
  SiPenpot, SiLangchain, SiOllama, SiMake, SiZapier, SiGraphql, 
  SiRaspberrypi, SiPlatformio, SiTensorflow, SiScikitlearn, SiPandas, 
  SiNumpy, SiRasa, SiYolo, SiMediapipe
} from 'react-icons/si';
import { 
  FaRobot, FaNetworkWired, FaShieldAlt, FaTerminal, FaServer, 
  FaLaptopCode, FaDatabase, FaPaintBrush, FaGlobe, FaBrain, FaLock,
  FaCode, FaMicrochip, FaAws, FaProjectDiagram, FaGithub, FaLinkedin,
  FaWifi, FaBluetooth, FaSpaceShuttle, FaSearch, FaCogs, FaSitemap,
  FaBug, FaDesktop, FaLink, FaLayerGroup, FaUserSecret, FaKey, FaEye, FaImage, FaBroadcastTower
} from 'react-icons/fa';

const iconMap = {
  // Languages & Core
  'html': SiHtml5, 'html5': SiHtml5,
  'css': SiCss, 'css3': SiCss,
  'js': SiJavascript, 'javascript': SiJavascript, 'es6': SiJavascript,
  'ts': SiTypescript, 'typescript': SiTypescript,
  'python': SiPython, 
  'java': FaCode, 
  'c++': SiCplusplus, 'cpp': SiCplusplus,
  'c#': FaCode, 'csharp': FaCode,
  'c': FaCode, 'embedded c': FaCode,
  'php': SiPhp,
  
  // Frameworks & Libs
  'react': SiReact, 'reactjs': SiReact, 'react.js': SiReact,
  'nextjs': SiNextdotjs, 'next.js': SiNextdotjs,
  'tailwind': SiTailwindcss, 'tailwindcss': SiTailwindcss, 'tailwind css': SiTailwindcss,
  'bootstrap': SiBootstrap,
  'vue': SiVuedotjs, 'vuejs': SiVuedotjs, 'vue.js': SiVuedotjs,
  'node': SiNodedotjs, 'nodejs': SiNodedotjs, 'node.js': SiNodedotjs,
  'express': SiExpress, 'expressjs': SiExpress, 'express.js': SiExpress,
  'django': SiDjango,
  'fastapi': SiFastapi,
  'flask': SiFlask,
  'spring': SiSpringboot, 'spring boot': SiSpringboot,
  
  // Databases 
  'postgres': SiPostgresql, 'postgresql': SiPostgresql,
  'mysql': SiMysql,
  'mongo': SiMongodb, 'mongodb': SiMongodb,
  'redis': SiRedis,
  'sqlite': SiSqlite,
  'firebase': SiFirebase,
  'supabase': SiSupabase,
  'database': FaDatabase,
  
  // DevOps & Infrastructure
  'aws': FaAws, 'amazon web services': FaAws,
  'docker': SiDocker,
  'ubuntu': SiUbuntu,
  'git': SiGit,
  'github': FaGithub,
  'vercel': SiVercel,
  'netlify': SiNetlify,
  'nginx': SiNginx,
  'linkedin': FaLinkedin,
  'vscode': FaCode, 'vs code': FaCode, 'visual studio code': FaCode,
  
  // Design & UI/UX
  'figma': SiFigma,
  'adobe xd': FaPaintBrush, 'photoshop': FaPaintBrush, 'illustrator': FaPaintBrush,
  'penpot': SiPenpot,
  'ui&ux': FaPaintBrush, 'ui/ux': FaPaintBrush, 'ui': FaPaintBrush, 'ux': FaPaintBrush, 'design': FaPaintBrush,
  'wireframing': FaLayerGroup, 'prototyping': FaLayerGroup, 'design systems': FaLayerGroup,
  
  // Hardware & IoT
  'arduino': SiArduino, 'arunio': SiArduino, 'arduino uno': SiArduino, 'arduino nano': SiArduino, 'arduino mega': SiArduino, 'arduino ide': SiArduino,
  'esp32': SiEspressif, 'espressif': SiEspressif, 'esp8266': SiEspressif, 'esp-idf': SiEspressif,
  'raspberry pi': SiRaspberrypi,
  'stm32': FaMicrochip,
  'iot': FaMicrochip, 'internet of things': FaMicrochip, 'embedded systems': FaMicrochip, 'microcontrollers': FaMicrochip,
  'platformio': SiPlatformio,
  
  // Protocols & Networking
  'wifi': FaWifi, 'wi-fi': FaWifi,
  'bluetooth': FaBluetooth, 'ble': FaBluetooth, 'bluetooth low energy': FaBluetooth,
  'mqtt': FaNetworkWired, 'http': FaGlobe, 'rest': FaGlobe, 'rest apis': FaGlobe, 'i2c': FaCogs, 'spi': FaCogs, 'uart': FaCogs, 'zigbee': FaBroadcastTower,
  'tcp/ip': FaNetworkWired, 'dns': FaGlobe, 'ssl/tls': FaLock, 'vpn': FaShieldAlt, 'vpns': FaShieldAlt, 'ssh': FaTerminal, 'oauth': FaKey, 'active directory': FaSitemap,
  
  // Cybersecurity & Ethical Hacking
  'kali linux': SiKalilinux,
  'nmap': FaSearch, 'nmap scanning': FaSearch,
  'burp suite': SiBurpsuite,
  'metasploit': SiMetasploit,
  'wireshark': SiWireshark,
  'owasp': SiOwasp, 'owasp zap': SiOwasp,
  'john the ripper': FaUserSecret, 'hydra': FaUserSecret, 'sqlmap': FaDatabase,
  'cybersecurity': FaShieldAlt, 'security': FaShieldAlt, 'cyber security': FaShieldAlt,
  'pen tester': FaTerminal, 'penetration testing': FaTerminal, 'ethical hacking': FaUserSecret,
  'vulnerability assessment': FaBug, 'privilege escalation': FaUserSecret, 'wireless auditing': FaWifi, 'reverse engineering': FaCogs,
  
  // Automation & Workflows
  'n8n': FaProjectDiagram, 'n8n workflow': FaProjectDiagram, 'n8n worflow': FaProjectDiagram,
  'make': SiMake, 'integromat': SiMake,
  'zapier': SiZapier,
  'power automate': FaCogs,
  'graphql': SiGraphql,
  'webhooks': FaLink, 'cron jobs': FaCogs,
  
  // AI, Machine Learning & Data Science
  'ai': FaBrain, 'ml': FaBrain, 'machine learning': FaBrain, 'artificial intelligence': FaBrain,
  'deep learning': FaBrain, 'nlp': FaBrain, 'natural language processing': FaBrain, 'neural networks': FaNetworkWired,
  'pytorch': SiPytorch,
  'tensorflow': SiTensorflow,
  'scikit-learn': SiScikitlearn,
  'pandas': SiPandas,
  'numpy': SiNumpy,
  
  // Computer Vision
  'opencv': SiOpencv, 'computer vision': FaEye, 'image processing': FaImage,
  'yolo': SiYolo,
  'mediapipe': SiMediapipe,
  'pillow': FaImage,
  
  // Chatbots, LLMs & Agents
  'ai agent': FaRobot, 'bot': FaRobot, 'chatbots': FaRobot,
  'rasa': SiRasa,
  'botpress': FaRobot, 
  'voiceflow': FaRobot,
  'deepseek': SiDeepseek,
  'gemini': SiGooglegemini, 'google gemini': SiGooglegemini,
  'huggingface': SiHuggingface, 'hugging face': SiHuggingface,
  'anthropic': SiAnthropic, 'claude': SiAnthropic,
  'openai': FaBrain, 'chatgpt': FaBrain, 'openai api': FaBrain, 'openai assistants api': FaBrain,
  'langchain': SiLangchain,
  'ollama': SiOllama,
  'llamaindex': FaDatabase,
  'flowise': FaProjectDiagram, 'langflow': FaProjectDiagram,
  'prompt engineering': FaTerminal, 'generative ai': FaBrain, 'rag': FaDatabase, 'chain-of-thought': FaBrain,
  
  // Generic IT categories
  'web development': FaGlobe, 'web': FaGlobe, 'web dev': FaGlobe,
  'devops': FaNetworkWired, 'hosting': FaServer,
  'backend': FaServer, 'back-end': FaServer,
  'frontend': FaLaptopCode, 'front-end': FaLaptopCode,
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
