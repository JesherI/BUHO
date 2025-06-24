import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

const TermsPage = () => {
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
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <h1 className="text-xl font-bold text-white">Términos de Uso</h1>
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
                <h2 className="text-2xl font-bold text-white mb-4">Términos y Condiciones de Uso</h2>
                <p className="text-gray-300 text-sm">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
              </div>

              <div className="space-y-8 text-gray-300">
                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">1. Aceptación de los Términos</h3>
                  <p className="leading-relaxed">
                    Al acceder y utilizar BUHO IA, usted acepta cumplir con estos términos y condiciones. 
                    Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">2. Descripción del Servicio</h3>
                  <p className="leading-relaxed mb-4">
                    BUHO IA es una plataforma de inteligencia artificial que proporciona servicios de chat y asistencia virtual. 
                    Nuestros servicios incluyen:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Conversaciones interactivas con IA</li>
                    <li>Asistencia en diversas tareas</li>
                    <li>Generación de contenido</li>
                    <li>Análisis y procesamiento de información</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">3. Uso Aceptable</h3>
                  <p className="leading-relaxed mb-4">Al utilizar nuestros servicios, usted se compromete a:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Usar el servicio de manera legal y ética</li>
                    <li>No intentar hackear o comprometer la seguridad del sistema</li>
                    <li>No generar contenido ilegal, ofensivo o dañino</li>
                    <li>Respetar los derechos de propiedad intelectual</li>
                    <li>No usar el servicio para actividades comerciales sin autorización</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">4. Privacidad y Datos</h3>
                  <p className="leading-relaxed">
                    Su privacidad es importante para nosotros. El manejo de sus datos personales se rige por nuestra 
                    Política de Privacidad, que forma parte integral de estos términos.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">5. Limitación de Responsabilidad</h3>
                  <p className="leading-relaxed">
                    BUHO IA se proporciona "tal como está". No garantizamos la precisión, completitud o confiabilidad 
                    de las respuestas generadas por la IA. El uso del servicio es bajo su propio riesgo.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">6. Modificaciones</h3>
                  <p className="leading-relaxed">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                    Las modificaciones entrarán en vigor inmediatamente después de su publicación.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-amber-400 mb-4">7. Contacto</h3>
                  <p className="leading-relaxed">
                    Si tiene preguntas sobre estos términos, puede contactarnos a través de nuestros canales oficiales.
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

export default TermsPage;