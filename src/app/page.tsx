import Link from 'next/link';
import { ArrowRight, Leaf, Activity, Zap, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D1D6CB]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#4C583E]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4C583E]/10 text-[#4C583E] text-xs font-bold uppercase tracking-widest mb-10 animate-fade-in">
              <Leaf className="h-3 w-3" /> Salud Bio-Individual & Longevidad
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-[#232323] leading-tight mb-8 animate-slide-up">
              Diseñamos el mapa hacia tu <span className="text-[#4C583E]">mejor versión</span>
            </h1>

            <p className="text-xl text-[#666666] leading-relaxed mb-12 max-w-2xl mx-auto">
              No es solo ejercicio. Es ciencia aplicada a tu metabolismo para extender tus años de vida saludable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/pricing"
                className="btn-primary"
              >
                Comenzar Protocolo <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="btn-outline"
              >
                Mi Acceso
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-[#F9FAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group">
              <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#4C583E] transition-colors duration-300">
                <Activity className="h-8 w-8 text-[#4C583E] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-[#232323] mb-4">Protocolo Activo</h3>
              <p className="text-[#666666] leading-relaxed">Planes nutricionales dinámicos que evolucionan con tus biomarcadores semanales.</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#4C583E] transition-colors duration-300">
                <CheckCircle2 className="h-8 w-8 text-[#4C583E] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-[#232323] mb-4">Proteína es Vida</h3>
              <p className="text-[#666666] leading-relaxed">Enfoque prioritario en masa muscular como el seguro de vida definitivo para la longevidad.</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#4C583E] transition-colors duration-300">
                <Zap className="h-8 w-8 text-[#4C583E] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-[#232323] mb-4">Bio-Individualidad</h3>
              <p className="text-[#666666] leading-relaxed">Cálculos precisos de TDEE y metabolismo basal. Tu plan es tan único como tu ADN.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square rounded-[40px] bg-[#D1D6CB] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-[#2C3424]/20 font-bold text-9xl">V+</div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#232323] mb-8 leading-tight">Vivir bien y por más tiempo <span className="text-[#4C583E]">es posible</span></h2>
            <p className="text-[#666666] text-lg leading-relaxed mb-10">
              ViveMás Coach es la culminación de años de investigación en salud metabólica y longevidad. Nuestra misión es darte las herramientas para que tomes el control de tu arquitectura biológica.
            </p>
            <ul className="space-y-6">
              {['Análisis profundo de datos', 'Planes de ejercicio inteligentes', 'Educación continua'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-[#232323] font-semibold">
                  <div className="w-6 h-6 rounded-full bg-[#4C583E] flex items-center justify-center text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
