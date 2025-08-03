import { Fragment, useState } from "react";
import { Copy, Check } from "lucide-react";

const MarkdownRenderer = ({ content }: { content: string }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Si el contenido es nulo o indefinido, devolver un fragmento vacío
  if (!content) return <Fragment></Fragment>;
  
  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };
  
  const renderInline = (text: string) => {
    const segments = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g).filter(Boolean);
    
    return segments.map((segment, i) => {
      // Negrita
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return <strong key={i}>{segment.slice(2, -2)}</strong>;
      }
      
      // Cursiva
      if (segment.startsWith("*") && segment.endsWith("*")) {
        return <em key={i}>{segment.slice(1, -1)}</em>;
      }
      
      // Enlaces [texto](url)
      const linkMatch = segment.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;
        return (
          <a 
            key={i} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-all duration-200 font-medium"
          >
            {text}
          </a>
        );
      }
      
      return <Fragment key={i}>{segment}</Fragment>;
    });
  };

  const renderPart = (part: string, index: number) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const codeContent = part.slice(3, -3).trim();
      const lines = codeContent.split('\n');
      const language = lines[0] && !lines[0].includes(' ') ? lines[0] : '';
      const code = language ? lines.slice(1).join('\n') : codeContent;
      
      return (
        <div key={index} className="relative group my-4">
          <div className="bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between bg-gray-900/50 px-4 py-2 border-b border-gray-800">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                {language || 'código'}
              </span>
              <button
                onClick={() => copyToClipboard(code, index)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Copiar código"
              >
                {copiedIndex === index ? (
                  <>
                    <Check size={12} className="text-green-400" />
                    <span className="text-green-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            {/* Contenido del código */}
            <pre className="p-4 overflow-x-auto bg-black text-gray-100">
              <code className="text-sm font-mono leading-relaxed">{code}</code>
            </pre>
          </div>
        </div>
      );
    }
    const lines = part.split("\n");
    const elements = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        const listItems = [];
        while (
          i < lines.length &&
          (lines[i].trim().startsWith("* ") || lines[i].trim().startsWith("- "))
        ) {
          listItems.push(lines[i].trim().substring(2));
          i++;
        }
        elements.push(
          <ul key={`ul-${index}-${i}`} className="list-none my-3 space-y-1">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5 text-xs">•</span>
                <span className="text-gray-100 leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }
      if (line.match(/^\d+\.\s/)) {
        const listItems = [];
        while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
          listItems.push(lines[i].replace(/^\d+\.\s/, ""));
          i++;
        }
        elements.push(
          <ol key={`ol-${index}-${i}`} className="list-none my-3 space-y-1">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5 text-xs font-medium min-w-[1.2rem]">{itemIndex + 1}.</span>
                <span className="text-gray-100 leading-relaxed">{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }
      if (line.trim()) {
        elements.push(
          <p key={`p-${index}-${i}`} className="my-2 text-gray-100 leading-relaxed">
            {renderInline(line)}
          </p>
        );
      } else {
        elements.push(
          <div key={`br-${index}-${i}`} className="h-2"></div>
        );
      }
      i++;
    }
    return <Fragment key={index}>{elements}</Fragment>;
  };

  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="prose prose-invert max-w-none">
      {parts.map(renderPart)}
    </div>
  );
};

export default MarkdownRenderer;
