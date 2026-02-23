'use client';

import { useUser } from '@/components/UserContext';
import { PLANS } from '@/lib/constants';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PricingPage() {
    const { currentUser } = useUser();

    const handleSubscribe = async (priceId: string) => {
        if (!currentUser) {
            alert('Por favor selecciona un usuario en la barra superior.');
            return;
        }

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, userId: currentUser.id }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error initiating checkout:', error);
        }
    };

    return (
        <div className="bg-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-fade-in">
                    <h2 className="text-[#4C583E] font-bold text-sm uppercase tracking-[0.2em] mb-4">Planes de Membresía</h2>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#232323] mb-8">Invierte en tu <span className="text-[#4C583E]">Longevidad</span></h1>
                    <p className="max-w-2xl mx-auto text-[#666666] text-lg leading-relaxed font-medium">
                        Nuestros planes están diseñados para acompañarte en cada etapa de tu transformación física y metabólica.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col p-10 rounded-[30px] transition-all duration-300 ${plan.popular
                                    ? 'bg-[#4C583E] text-white shadow-[0_20px_50px_rgba(76,88,62,0.3)] scale-105 z-10'
                                    : 'bg-[#F9FAF9] border border-zinc-100 text-[#232323] hover:shadow-xl'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D1D6CB] text-[#2C3424] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border-2 border-white">
                                    Más Popular
                                </div>
                            )}

                            <div className="mb-10 text-center">
                                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-[#232323]'}`}>{plan.name}</h3>
                                <p className={`text-sm ${plan.popular ? 'text-white/70' : 'text-[#666666] font-medium'}`}>{plan.description}</p>
                            </div>

                            <div className="mb-10 flex items-center justify-center">
                                <span className="text-5xl font-bold">${plan.displayPrice}</span>
                                <span className={`ml-2 text-sm uppercase tracking-widest font-bold ${plan.popular ? 'text-white/60' : 'text-[#666666]/60'}`}>
                                    / {plan.period}
                                </span>
                            </div>

                            <div className={`h-px w-full mb-10 ${plan.popular ? 'bg-white/10' : 'bg-zinc-200'}`} />

                            <ul className="space-y-5 mb-12 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm font-medium">
                                        <Check className={`h-5 w-5 shrink-0 ${plan.popular ? 'text-white' : 'text-[#4C583E]'}`} />
                                        <span className={plan.popular ? 'text-white/90' : 'text-[#666666]'}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.stripePriceId)}
                                className={`w-full h-[60px] rounded-full font-bold flex flex-row items-center justify-center gap-3 transition-all group ${plan.popular
                                        ? 'bg-[#D1D6CB] text-[#2C3424] hover:bg-white active:scale-95'
                                        : 'bg-[#4C583E] text-white hover:bg-[#3d4732] active:scale-95'
                                    }`}
                            >
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                <span>Elegir Plan</span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D1D6CB]/20 text-[#4C583E] text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck className="h-4 w-4" /> Pago 100% Seguro vía Stripe
                    </div>
                </div>
            </div>
        </div>
    );
}
