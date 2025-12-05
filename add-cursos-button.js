const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'components', 'sidebar', 'sidebar.tsx');

// Leer el archivo
let content = fs.readFileSync(filePath, 'utf8');

// El botón de Cursos que queremos agregar
const cursosButton = `              <button
                onClick={() => router.push('/courses')}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              >
                <BookOpen size={16} />
                <span>Cursos</span>
              </button>
`;

// Buscar el patrón donde termina el botón de Tareas y antes de </div></div>
// Usamos una expresión regular para ser más flexible con los espacios en blanco
const pattern = /(              <\/button>\r?\n            <\/div>\r?\n          <\/div>)/;

// Texto de reemplazo que incluye el botón de Cursos
const replacement = `              </button>\n${cursosButton}            </div>\n          </div>`;

// Reemplazar
content = content.replace(pattern, replacement);

// Guardar el archivo
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Archivo modificado exitosamente');
