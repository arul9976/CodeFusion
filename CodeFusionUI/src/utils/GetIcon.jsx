import { FaCss3, FaHtml5, FaJava, FaPython, FaSass } from 'react-icons/fa';
import { VscRuby, VscJson } from 'react-icons/vsc';
import { TbBrandGolang, TbBrandJavascript } from 'react-icons/tb';
import { PiFileCppBold } from 'react-icons/pi';
import { LuCodeXml } from 'react-icons/lu';
import { BiLogoTypescript } from 'react-icons/bi';


const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'js':
    case 'jsx':
      return <TbBrandJavascript size={16} color="#f7df1e" />;
    case 'ts':
    case 'tsx':
      return <BiLogoTypescript size={16} color="#3178c6" />;
    case 'css':
      return <FaCss3 size={16} color="#264de4" />;
    case 'scss':
    case 'less':
      return <FaSass size={16} color="#c6538c" />;
    case 'html':
    case 'xml':
      return <FaHtml5 size={16} color="#e34c26" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return <Image size={16} color="#a972cc" />;
    case 'svg':
      return <Image size={16} color="#ffb13b" />;
    case 'py':
    case 'pyw':
      return <FaPython size={16} color="#3776ab" />;
    case 'java':
      return <FaJava size={16} color="#f89820" />;
    case 'php':
      return <Code size={16} color="#777bb4" />;
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
      return <PiFileCppBold size={16} color="#00599c" />;
    case 'rb':
      return <VscRuby size={16} color="#cc342d" />;
    case 'go':
      return <TbBrandGolang size={16} color="#00add8" />;
    case 'json':
      return <VscJson size={16} color="#f0db4f" />;
    case 'md':
    case 'markdown':
      return <LuCodeXml size={16} color="#ff4500" />;
    default:
      return <FileText size={16} color="#8f8f8f" />;
  }
};


const getFileMode = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  console.log(extension);

  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'css':
    case 'scss':
    case 'less':
      return 'css';
    case 'html':
      return 'html';
    case 'py':
    case 'pyw':
      return 'python';
    case 'java':
      return 'java';
    case 'php':
      return 'php';
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
      return 'c_cpp';
    case 'rb':
      return 'ruby';
    case 'go':
      return 'golang';
    case 'json':
      return 'json';
    case 'md':
    case 'markdown':
      return 'markdown';
    default:
      return 'text';
  }
};



export { getFileIcon, getFileMode };