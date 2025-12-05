$filePath = "c:\Users\jeshe\OneDrive\Escritorio\Buho pruebas\BUHO\app\components\sidebar\sidebar.tsx"
$content = Get-Content $filePath -Raw

# Buscar el patrón donde termina el botón de Tareas
$searchPattern = "              </button>`r`n            </div>`r`n          </div>"

# El texto de reemplazo que incluye el botón de Cursos
$replacement = @"
              </button>
              <button
                onClick={() => router.push('/courses')}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              >
                <BookOpen size={16} />
                <span>Cursos</span>
              </button>
            </div>
          </div>
"@

# Reemplazar
$newContent = $content.Replace($searchPattern, $replacement)

# Guardar el archivo
$newContent | Set-Content $filePath -NoNewline

Write-Host "Archivo modificado exitosamente"
