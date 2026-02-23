'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/UserContext';
import { PLANS } from '@/lib/constants';
import {
    AlertCircle,
    Calendar,
    Zap,
    TrendingUp,
    User,
    CreditCard,
    ChevronRight,
    Activity
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { currentUser } = useUser();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user?userId=${currentUser?.id}`);
            const data = await res.json();
            setUserData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpsell = async (targetPriceId: string) => {
        if (!confirm('¿Deseas realizar el upgrade ahora? Se cobrará la diferencia prorrateada inmediatamente.')) return;

        try {
            const res = await fetch('/api/upsell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser?.id, targetPriceId }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Upgrade exitoso! Tu protocolo ha sido actualizado.');
                fetchUserData();
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePortal = async () => {
        try {
            const res = await fetch('/api/portal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser?.id }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div className="p-20 text-center text-[#666666] font-medium italic">Sincronizando tus biomarcadores...</div>;
    }

    const activePlan = PLANS.find(p => p.stripePriceId === userData?.price_id);
    const isMonthly = userData?.price_id === 'prod_U243qAeqJyw9Hs';

    return (
        <div className="bg-[#F9FAF9] min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 bg-white p-8 rounded-[30px] shadow-sm border border-zinc-100">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-[#4C583E]/10 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                            <User className="h-8 w-8 text-[#4C583E]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#232323] tracking-tight">Protocolo de {currentUser?.name}</h1>
                            <p className="text-[#666666] font-medium flex items-center gap-2">
                                <Activity className="h-4 w-4 text-[#4C583E]" /> Estado de Longevidad
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-zinc-200 shadow-sm">
                        <div className={`w-2.5 h-2.5 rounded-full ${userData?.subscription_status === 'active' ? 'bg-[#4C583E]' : 'bg-zinc-300'}`} />
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{userData?.subscription_status || 'Inactivo'}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Status Card */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white p-10 rounded-[35px] border border-zinc-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Zap className="h-32 w-32 text-[#4C583E]" />
                            </div>

                            <h2 className="text-xl font-bold mb-10 flex items-center gap-3 text-[#232323]">
                                <Activity className="h-6 w-6 text-[#4C583E]" /> Membresía Actual
                            </h2>

                            {userData?.subscription_status === 'active' ? (
                                <div className="space-y-8 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-[25px] bg-[#F9FAF9] border border-zinc-100 group hover:border-[#4C583E]/30 transition-colors">
                                            <div className="text-[10px] text-[#4C583E] font-bold mb-2 uppercase tracking-widest opacity-70">Plan Activo</div>
                                            <div className="text-2xl font-bold text-[#232323] mb-3">{activePlan?.name || 'Suscripción ViveMás'}</div>
                                            <div className="flex items-center text-[#666666] text-sm gap-2 font-medium">
                                                <Calendar className="h-4 w-4" />
                                                Expira: {userData.period_end ? new Date(userData.period_end * 1000).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-[25px] bg-[#F9FAF9] border border-zinc-100">
                                            <div className="text-[10px] text-[#4C583E] font-bold mb-2 uppercase tracking-widest opacity-70">Método de Pago</div>
                                            <div className="flex items-center gap-3 text-[#232323] font-bold mb-3">
                                                <CreditCard className="h-5 w-5" /> Visa **** 4242
                                            </div>
                                            <button onClick={handlePortal} className="text-xs text-[#4C583E] font-bold hover:underline">Gestionar en Stripe</button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-5">
                                        <button
                                            onClick={handlePortal}
                                            className="btn-primary flex-1"
                                        >
                                            Panel de Facturación
                                        </button>
                                        <Link
                                            href="/admin"
                                            className="btn-outline flex-1"
                                        >
                                            Soporte Técnico
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-[#F9FAF9] rounded-[30px] border border-dashed border-zinc-200">
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-8 shadow-sm">
                                        <AlertCircle className="h-10 w-10 text-zinc-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#232323] mb-4">No tienes un protocolo activo</h3>
                                    <p className="text-[#666666] mb-10 max-w-sm mx-auto leading-relaxed">Suscríbete ahora para obtener tu primer análisis bio-individual y comenzar tu transformación.</p>
                                    <Link href="/pricing" className="btn-primary inline-flex">
                                        Ver Planes <ChevronRight className="h-5 w-5" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upsell Card */}
                    <div className="space-y-10">
                        {userData?.subscription_status === 'active' && isMonthly && (
                            <div className="p-10 rounded-[40px] bg-[#4C583E] text-white shadow-[0_20px_60px_rgba(76,88,62,0.4)] relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp className="h-48 w-48 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold mb-6 relative z-10 leading-tight">Potencia tu Longevidad</h3>
                                <p className="text-white/80 text-lg mb-10 relative z-10 leading-relaxed font-medium">
                                    Cambia a nuestro plan <strong>Trimestral</strong> hoy y obtén un descuento automático del 15% en tu renovación.
                                </p>
                                <button
                                    onClick={() => handleUpsell('prod_U247Ra3QAPthY9')}
                                    className="w-full py-5 rounded-full bg-[#D1D6CB] text-[#2C3424] font-bold text-lg shadow-xl hover:bg-white transition-all relative z-10"
                                >
                                    Aplicar Upgrade
                                </button>
                                <p className="mt-6 text-[10px] text-white/50 text-center uppercase font-bold tracking-[0.3em]">Exclusivo Miembros Activos</p>
                            </div>
                        )}

                        <div className="bg-white p-8 rounded-[30px] border border-zinc-100 shadow-sm">
                            <h4 className="font-bold text-[#232323] mb-6 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-[#4C583E]" /> Próximos Pasos
                            </h4>
                            <ul className="space-y-4">
                                {['Revisión de biomarcadores', 'Ajuste de macronutrientes', 'Control de carga muscular'].map((step, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-[#666666] font-medium p-3 rounded-xl bg-[#F9FAF9]">
                                        <div className="w-2 h-2 rounded-full bg-[#4C583E]" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
