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

  const renderCodeWithSyntaxHighlight = (code: string) => {
    // Patrones para diferentes elementos de sintaxis
    const patterns = {
      // Comentarios
      comment: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$|<!--[\s\S]*?-->)/gm,
      // Strings
      string: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
      // Números
      number: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g,
      // Palabras clave comunes
      keyword: new RegExp(
        '\\b(' +
        'function|const|let|var|if|else|for|while|return|class|import|export|from|as|default|' +
        'async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|' +
        'enum|public|private|protected|static|abstract|readonly|namespace|module|declare|' +
        'void|null|undefined|true|false|boolean|string|number|object|any|unknown|never' +
        ')\\b',
        'g'
      ),
      // Operadores
      operator: /[+\-*/%=<>!&|^~?:]/g,
      // Paréntesis y llaves
      // oxlint-disable-next-line no-useless-escape
      bracket: /[()\[\]{}]/g,
      // Funciones (palabra seguida de paréntesis)
      functionCall: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g,
      // Variables y propiedades
      variable: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g
    };

    let highlightedCode = code;
    const replacements: Array<{ start: number, end: number, replacement: string }> = [];

    // Procesar comentarios
    let match;
    while ((match = patterns.comment.exec(code)) !== null) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement: `<span style="color: #228B22; font-style: italic;">${match[0]}</span>`
      });
    }

    // Procesar strings
    patterns.string.lastIndex = 0;
    while ((match = patterns.string.exec(code)) !== null) {
      if (!isInsideReplacement(match.index, replacements)) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: `<span style="color: #FF1493;">${match[0]}</span>`
        });
      }
    }

    // Procesar números
    patterns.number.lastIndex = 0;
    while ((match = patterns.number.exec(code)) !== null) {
      if (!isInsideReplacement(match.index, replacements)) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: `<span style="color: #0066FF;">${match[0]}</span>`
        });
      }
    }

    // Procesar palabras clave
    patterns.keyword.lastIndex = 0;
    while ((match = patterns.keyword.exec(code)) !== null) {
      if (!isInsideReplacement(match.index, replacements)) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: `<span style="color: #8A2BE2; font-weight: 600;">${match[0]}</span>`
        });
      }
    }

    // Procesar llamadas a funciones
    patterns.functionCall.lastIndex = 0;
    while ((match = patterns.functionCall.exec(code)) !== null) {
      if (!isInsideReplacement(match.index, replacements)) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: `<span style="color: #FFD700; font-weight: 500;">${match[0]}</span>`
        });
      }
    }

    // Procesar operadores
    patterns.operator.lastIndex = 0;
    while ((match = patterns.operator.exec(code)) !== null) {
      if (!isInsideReplacement(match.index, replacements)) {
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: `<span style="color: #FF4500;">${match[0]}</span>`
        });
      }
    }

    // Procesar paréntesis y llaves
    patterns.bracket.lastIndex = 0;
    while ((match = patterns.bracket.exec(code)) !== null) {
      if (!isInsideReplacement(match.index, replacements)) {
        const colors = {
          '(': '#00CED1', ')': '#00CED1',
          '[': '#DC143C', ']': '#DC143C',
          '{': '#4B0082', '}': '#4B0082'
        };
        const color = colors[match[0] as keyof typeof colors] || '#32CD32';
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          replacement: `<span style="color: ${color}; font-weight: 600;">${match[0]}</span>`
        });
      }
    }

    // Aplicar reemplazos en orden inverso para mantener índices correctos
    replacements.sort((a, b) => b.start - a.start);

    for (const replacement of replacements) {
      highlightedCode =
        highlightedCode.slice(0, replacement.start) +
        replacement.replacement +
        highlightedCode.slice(replacement.end);
    }

    return <span dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
  };

  const isInsideReplacement = (index: number, replacements: Array<{ start: number, end: number, replacement: string }>) => {
    return replacements.some(r => index >= r.start && index < r.end);
  };

  const renderInline = (text: string) => {
    // Primero procesamos las etiquetas <br> para convertirlas en saltos de línea
    const textWithBreaks = text.replace(/<br\s*\/?>/gi, '\n');

    const segments = textWithBreaks.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|~~.*?~~|\[.*?\]\(.*?\))/g).filter(Boolean);

    return segments.map((segment, i) => {
      // Manejar saltos de línea
      if (segment.includes('\n')) {
        const lines = segment.split('\n');
        return (
          <Fragment key={i}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </Fragment>
        );
      }
      // Negrita
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return <strong key={i}>{segment.slice(2, -2)}</strong>;
      }

      // Cursiva
      if (segment.startsWith("*") && segment.endsWith("*") && !segment.startsWith("**")) {
        return <em key={i}>{segment.slice(1, -1)}</em>;
      }

      // Código inline
      if (segment.startsWith("`") && segment.endsWith("`")) {
        return (
          <code key={i} className="bg-gray-800 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">
            {segment.slice(1, -1)}
          </code>
        );
      }

      // Texto tachado
      if (segment.startsWith("~~") && segment.endsWith("~~")) {
        return (
          <span key={i} className="line-through text-gray-400">
            {segment.slice(2, -2)}
          </span>
        );
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

  const renderTable = (tableText: string, index: number) => {
    const lines = tableText.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;

    // Procesar headers - remover pipes al inicio y final si existen
    const headerLine = lines[0].replace(/^\|/, '').replace(/\|$/, '');
    const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);

    const separatorLine = lines[1];

    // Verificar que es una tabla válida
    if (!separatorLine.includes('-') || headers.length === 0) return null;

    // Procesar filas de datos
    const rows: string[][] = lines.slice(2).map(line => {
      const cleanLine = line.replace(/^\|/, '').replace(/\|$/, '');
      const cells = cleanLine.split('|').map(cell => cell.trim());
      // Asegurar que cada fila tenga el mismo número de celdas que los headers
      while (cells.length < headers.length) {
        cells.push('');
      }
      return cells.slice(0, headers.length);
    }).filter((row: string[]) => {
      // Filtrar filas que tengan al menos una celda con contenido
      // oxlint-disable-next-line no-useless-length-check
      return row.length > 0 && row.some((cell: string) => cell !== '');
    });

    return (
      <div key={index} className="my-4 overflow-x-auto">
        <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="px-4 py-2 text-left text-gray-200 font-medium border-b border-gray-700">
                  {renderInline(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/50'}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 text-gray-100 border-b border-gray-700/50">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPart = (part: string, index: number) => {
    // Detectar tablas
    if (part.includes('|') && part.includes('-')) {
      const lines = part.split('\n');
      let tableStart = -1;
      let tableEnd = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('|') && lines[i + 1]?.includes('-')) {
          tableStart = i;
          break;
        }
      }

      if (tableStart !== -1) {
        for (let i = tableStart + 2; i < lines.length; i++) {
          if (!lines[i].includes('|') || lines[i].trim() === '') {
            tableEnd = i;
            break;
          }
        }
        if (tableEnd === -1) tableEnd = lines.length;

        const beforeTable = lines.slice(0, tableStart).join('\n');
        const tableContent = lines.slice(tableStart, tableEnd).join('\n');
        const afterTable = lines.slice(tableEnd).join('\n');

        return (
          <Fragment key={index}>
            {beforeTable && renderPart(beforeTable, index * 1000)}
            {renderTable(tableContent, index * 1000 + 1)}
            {afterTable && renderPart(afterTable, index * 1000 + 2)}
          </Fragment>
        );
      }
    }

    if (part.startsWith("```") && part.endsWith("```")) {
      const codeContent = part.slice(3, -3).trim();
      const lines = codeContent.split('\n');
      const language = lines[0] && !lines[0].includes(' ') ? lines[0] : '';
      const code = language ? lines.slice(1).join('\n') : codeContent;

      return (
        <div key={index} className="relative group my-3 sm:my-4">
          <div className="bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between bg-gray-900/50 px-3 sm:px-4 py-2 border-b border-gray-800">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wide truncate">
                {language || 'código'}
              </span>
              <button
                onClick={() => copyToClipboard(code, index)}
                className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
                title="Copiar código"
              >
                {copiedIndex === index ? (
                  <>
                    <Check size={12} className="text-green-400" />
                    <span className="text-green-400 hidden sm:inline">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span className="hidden sm:inline">Copiar</span>
                  </>
                )}
              </button>
            </div>
            {/* Contenido del código */}
            <pre className="p-3 sm:p-4 overflow-x-auto bg-black text-gray-100 text-xs sm:text-sm">
              <code className="font-mono leading-relaxed whitespace-pre">{renderCodeWithSyntaxHighlight(code)}</code>
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
          const itemText = lines[i].trim().substring(2);
          const isTask = itemText.startsWith("[ ]") || itemText.startsWith("[x]") || itemText.startsWith("[X]");

          if (isTask) {
            const isChecked = itemText.startsWith("[x]") || itemText.startsWith("[X]");
            const taskText = itemText.substring(3).trim();
            listItems.push({ text: taskText, isTask: true, isChecked });
          } else {
            listItems.push({ text: itemText, isTask: false, isChecked: false });
          }
          i++;
        }

        elements.push(
          <ul key={`ul-${index}-${i}`} className="list-none my-2 sm:my-3 space-y-1">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start gap-2">
                {item.isTask ? (
                  <span className={`mt-1.5 text-xs flex-shrink-0 ${item.isChecked ? 'text-green-400' : 'text-gray-400'}`}>
                    {item.isChecked ? '☑' : '☐'}
                  </span>
                ) : (
                  <span className="text-blue-400 mt-1.5 text-xs flex-shrink-0">•</span>
                )}
                <span className={`leading-relaxed break-words ${item.isTask && item.isChecked ? 'text-gray-400 line-through' : 'text-gray-100'
                  }`}>
                  {renderInline(item.text)}
                </span>
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
          <ol key={`ol-${index}-${i}`} className="list-none my-2 sm:my-3 space-y-1">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5 text-xs font-medium min-w-[1.2rem] flex-shrink-0">{itemIndex + 1}.</span>
                <span className="text-gray-100 leading-relaxed break-words">{renderInline(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }
      // Encabezados
      if (line.trim().startsWith('#')) {
        const level = Math.min(line.match(/^#+/)?.[0].length || 1, 6);
        const text = line.replace(/^#+\s*/, '');
        const headingClasses: Record<number, string> = {
          1: 'text-2xl sm:text-3xl font-bold text-white my-4 sm:my-6',
          2: 'text-xl sm:text-2xl font-bold text-white my-3 sm:my-5',
          3: 'text-lg sm:text-xl font-semibold text-white my-3 sm:my-4',
          4: 'text-base sm:text-lg font-semibold text-gray-200 my-2 sm:my-3',
          5: 'text-sm sm:text-base font-medium text-gray-300 my-2',
          6: 'text-xs sm:text-sm font-medium text-gray-400 my-1'
        };

        const className = headingClasses[level] || headingClasses[6];

        if (level === 1) {
          elements.push(<h1 key={`h-${index}-${i}`} className={className}>{renderInline(text)}</h1>);
        } else if (level === 2) {
          elements.push(<h2 key={`h-${index}-${i}`} className={className}>{renderInline(text)}</h2>);
        } else if (level === 3) {
          elements.push(<h3 key={`h-${index}-${i}`} className={className}>{renderInline(text)}</h3>);
        } else if (level === 4) {
          elements.push(<h4 key={`h-${index}-${i}`} className={className}>{renderInline(text)}</h4>);
        } else if (level === 5) {
          elements.push(<h5 key={`h-${index}-${i}`} className={className}>{renderInline(text)}</h5>);
        } else {
          elements.push(<h6 key={`h-${index}-${i}`} className={className}>{renderInline(text)}</h6>);
        }
      }
      // Citas (blockquotes)
      else if (line.trim().startsWith('>')) {
        const quoteText = line.replace(/^>\s*/, '');
        elements.push(
          <blockquote key={`quote-${index}-${i}`} className="border-l-4 border-blue-400 pl-4 my-3 bg-gray-900/30 py-2 rounded-r">
            <p className="text-gray-200 italic">{renderInline(quoteText)}</p>
          </blockquote>
        );
      }
      // Líneas horizontales
      else if (line.trim().match(/^(-{3,}|\*{3,}|_{3,})$/)) {
        elements.push(
          <hr key={`hr-${index}-${i}`} className="border-gray-600 my-4" />
        );
      }
      // Párrafos normales
      else if (line.trim()) {
        elements.push(
          <p key={`p-${index}-${i}`} className="my-1.5 sm:my-2 text-gray-100 leading-relaxed break-words">
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
    <div className="prose prose-invert max-w-none overflow-hidden">
      {parts.map(renderPart)}
    </div>
  );
};

export default MarkdownRenderer;
