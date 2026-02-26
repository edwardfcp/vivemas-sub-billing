import db from '@/lib/db';
import { Users, ShoppingBag, CreditCard, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    await db.init();
    const users = await db.query('SELECT * FROM users') as any[];
    const orders = await db.query('SELECT orders.*, users.name as user_name FROM orders JOIN users ON orders.user_id = users.id ORDER BY created_at DESC') as any[];

    return (
        <div className="bg-[#F9FAF9] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div className="flex items-center gap-5">
                        <Link href="/dashboard" className="p-3 rounded-full bg-white border border-zinc-200 text-[#4C583E] hover:bg-zinc-50 transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-[#232323] tracking-tight">Admin Console</h1>
                            <p className="text-[#666666] font-medium flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-[#4C583E]" /> Monitoreo de Transacciones
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#4C583E]/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-[#4C583E]" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Usuarios</div>
                                <div className="text-xl font-bold text-[#232323]">{users.length}</div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#D1D6CB]/30 flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-[#2C3424]" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Órdenes</div>
                                <div className="text-xl font-bold text-[#232323]">{orders.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Users Table */}
                    <div className="lg:col-span-2 space-y-10">
                        <section className="bg-white p-10 rounded-[35px] border border-zinc-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                            <h2 className="text-xl font-bold mb-10 flex items-center gap-3 text-[#232323]">
                                <Users className="h-6 w-6 text-[#4C583E]" /> Base de Datos de Usuarios
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] border-b border-zinc-50">
                                        <tr>
                                            <th className="pb-6">Perfil</th>
                                            <th className="pb-6">Estado</th>
                                            <th className="pb-6">Plan Activo</th>
                                            <th className="pb-6 text-right">Caducidad</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {users.map((user) => (
                                            <tr key={user.id} className="text-zinc-600 group">
                                                <td className="py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-[#4C583E] text-xs">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-[#232323]">{user.name}</div>
                                                            <div className="text-xs font-medium opacity-60 italic">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.subscription_status === 'active'
                                                        ? 'bg-[#4C583E]/10 text-[#4C583E]'
                                                        : 'bg-zinc-100 text-zinc-400'
                                                        }`}>
                                                        {user.subscription_status}
                                                    </span>
                                                </td>
                                                <td className="py-6">
                                                    <div className="font-mono text-[10px] bg-zinc-50 px-2 py-1 rounded w-fit border border-zinc-100">
                                                        {user.price_id ? user.price_id.slice(-12) : '---'}
                                                    </div>
                                                </td>
                                                <td className="py-6 text-right font-medium text-zinc-500">
                                                    {user.period_end ? new Date(user.period_end * 1000).toLocaleDateString() : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Orders Log */}
                    <div className="space-y-10">
                        <section className="bg-white p-10 rounded-[35px] border border-zinc-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-full">
                            <h2 className="text-xl font-bold mb-10 flex items-center gap-3 text-[#232323]">
                                <Clock className="h-6 w-6 text-[#4C583E]" /> Registro de Actividad
                            </h2>
                            <div className="space-y-6">
                                {orders.length === 0 ? (
                                    <div className="text-center py-20 text-zinc-300 italic flex flex-col items-center gap-4">
                                        <ShoppingBag className="h-10 w-10 opacity-20" />
                                        Sin transacciones aún.
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.id} className="p-6 rounded-[25px] bg-[#F9FAF9] border border-zinc-100 hover:border-[#4C583E]/20 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="text-xl font-bold text-[#4C583E]">${(order.amount / 100).toFixed(2)}</div>
                                                <div className="text-[10px] bg-white border border-zinc-200 px-3 py-1 rounded-full text-zinc-400 font-bold uppercase tracking-tighter">{order.id.slice(-8)}</div>
                                            </div>
                                            <div className="text-sm font-bold text-[#232323] mb-2">{order.user_name}</div>
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                                <Clock className="h-3 w-3" />
                                                {new Date(order.created_at * 1000).toLocaleDateString()} • {new Date(order.created_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
