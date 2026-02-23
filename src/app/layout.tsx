import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/UserContext";
import UserSelector from "@/components/UserSelector";
import Link from 'next/link';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "ViveMás Coach | Longevidad & Salud",
  description: "Diseño de protocolos bio-individuales para extender tu vida saludable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable}`}>
      <body className={montserrat.className}>
        <UserProvider>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
                <div className="flex items-center gap-12">
                  <Link href="/" className="flex items-center">
                    <div className="bg-[#4C583E] text-white px-4 py-2 rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] rounded-br-[25px] font-bold tracking-tight text-xl">
                      ViveMás <span className="font-light">Coach</span>
                    </div>
                  </Link>
                  <nav className="hidden md:flex gap-8 text-sm font-semibold text-zinc-500 uppercase tracking-widest">
                    <Link href="/dashboard" className="hover:text-[#4C583E] transition-colors">Dashboard</Link>
                    <Link href="/pricing" className="hover:text-[#4C583E] transition-colors">Precios</Link>
                    <Link href="/admin" className="hover:text-[#4C583E] transition-colors">Admin</Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <UserSelector />
                </div>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-[#2C3424] py-16 text-white/80">
              <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 border-b border-white/10 pb-12 mb-12 text-sm">
                <div>
                  <div className="bg-white/10 w-fit px-3 py-1 rounded inline-block mb-4">ViveMás Coach</div>
                  <p className="leading-relaxed">Tu portal bio-individual para una vida más larga y saludable.</p>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-white uppercase tracking-widest text-xs">Enlaces</h4>
                  <div className="flex flex-col gap-2">
                    <Link href="/pricing" className="hover:text-white transition-colors">Protocolos</Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors">Mi Panel</Link>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-white uppercase tracking-widest text-xs">Contacto</h4>
                  <p>Salud & Longevidad</p>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 text-center text-xs tracking-widest uppercase mb-4">
                &copy; {new Date().getFullYear()} ViveMás Coach. Todos los derechos reservados.
              </div>
            </footer>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
