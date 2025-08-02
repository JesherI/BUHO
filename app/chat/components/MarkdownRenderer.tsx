import { Fragment } from "react";

const MarkdownRenderer = ({ content }: { content: string }) => {
  // Si el contenido es nulo o indefinido, devolver un fragmento vacío
  if (!content) return <Fragment></Fragment>;
  
  const renderInline = (text: string) => {
    // Expresión regular para detectar formatos de texto y enlaces
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
            className="text-amber-400 hover:text-amber-300 underline"
          >
            {text}
          </a>
        );
      }
      
      // Texto normal
      return <Fragment key={i}>{segment}</Fragment>;
    });
  };

  const renderPart = (part: string, index: number) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).trim();
      return (
        <pre key={index} className="bg-gray-900 p-3 rounded-lg my-2 overflow-x-auto">
          <code className="text-white text-sm font-mono">{code}</code>
        </pre>
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
          <ul key={`ul-${index}-${i}`} className="list-disc list-inside my-2 pl-4">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item)}</li>
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
          <ol key={`ol-${index}-${i}`} className="list-decimal list-inside my-2 pl-4">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInline(item)}</li>
            ))}
          </ol>
        );
        continue;
      }
      if (line.trim()) {
        elements.push(
          <p key={`p-${index}-${i}`} className="my-1">
            {renderInline(line)}
          </p>
        );
      }
      i++;
    }
    return <Fragment key={index}>{elements}</Fragment>;
  };

  const parts = content.split(/(```[\s\S]*?```)/g);
  return <div>{parts.map(renderPart)}</div>;
};

export default MarkdownRenderer;
