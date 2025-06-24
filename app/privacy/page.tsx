import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-amber-400/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center border border-amber-400/20">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <h1 className="text-xl font-bold text-white">Política de Privacidad</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-black/30 backdrop-blur-xl rounded-xl border border-amber-400/20 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="prose prose-amber max-w-none">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Política de Privacidad</h2>
                <p className="text-gray-300 text-sm">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
              </div>

              <div className="space-y-8 text-gray-300">
                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">1. Información que Recopilamos</h3>
                  <p className="leading-relaxed mb-4">
                    En BUHO IA, recopilamos diferentes tipos de información para brindarle el mejor servicio posible:
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Información de Cuenta:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Nombre de usuario y correo electrónico</li>
                        <li>Información de perfil que proporcione</li>
                        <li>Preferencias de configuración</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Información de Uso:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Conversaciones y mensajes con la IA</li>
                        <li>Páginas visitadas y funciones utilizadas</li>
                        <li>Tiempo de uso y frecuencia de acceso</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">2. Cómo Utilizamos su Información</h3>
                  <p className="leading-relaxed mb-4">Utilizamos la información recopilada para:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Proporcionar y mejorar nuestros servicios de IA</li>
                    <li>Personalizar su experiencia de usuario</li>
                    <li>Entrenar y optimizar nuestros modelos de IA</li>
                    <li>Comunicarnos con usted sobre actualizaciones del servicio</li>
                    <li>Detectar y prevenir uso fraudulento o abusivo</li>
                    <li>Cumplir con obligaciones legales</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">3. Compartir Información</h3>
                  <p className="leading-relaxed mb-4">
                    No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes circunstancias:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Con su consentimiento explícito</li>
                    <li>Para cumplir con requisitos legales</li>
                    <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                    <li>En caso de fusión, adquisición o venta de activos</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">4. Seguridad de Datos</h3>
                  <p className="leading-relaxed mb-4">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Cifrado de datos en tránsito y almacenamiento</li>
                    <li>Controles de acceso estrictos</li>
                    <li>Monitoreo continuo de seguridad</li>
                    <li>Auditorías regulares de seguridad</li>
                    <li>Backup y recuperación de datos</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">5. Sus Derechos</h3>
                  <p className="leading-relaxed mb-4">Usted tiene derecho a:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Acceder a su información personal</li>
                    <li>Corregir datos inexactos o incompletos</li>
                    <li>Solicitar la eliminación de sus datos</li>
                    <li>Limitar el procesamiento de su información</li>
                    <li>Portabilidad de datos</li>
                    <li>Oponerse al procesamiento de sus datos</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">6. Retención de Datos</h3>
                  <p className="leading-relaxed">
                    Conservamos su información personal solo durante el tiempo necesario para los fines descritos en esta política, 
                    o según lo exija la ley. Las conversaciones pueden conservarse para mejorar nuestros servicios, 
                    pero se anonimizan cuando es posible.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">7. Cookies y Tecnologías Similares</h3>
                  <p className="leading-relaxed">
                    Utilizamos cookies y tecnologías similares para mejorar la funcionalidad del sitio, 
                    analizar el uso y personalizar el contenido. Puede controlar las cookies a través de 
                    la configuración de su navegador.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">8. Menores de Edad</h3>
                  <p className="leading-relaxed">
                    Nuestros servicios no están dirigidos a menores de 13 años. No recopilamos conscientemente 
                    información personal de menores de 13 años sin el consentimiento de los padres.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">9. Cambios en esta Política</h3>
                  <p className="leading-relaxed">
                    Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios 
                    significativos a través de correo electrónico o mediante un aviso prominente en nuestro servicio.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">10. Contacto</h3>
                  <p className="leading-relaxed">
                    Si tiene preguntas sobre esta política de privacidad o sobre cómo manejamos sus datos, 
                    puede contactarnos a través de nuestros canales oficiales de soporte.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;