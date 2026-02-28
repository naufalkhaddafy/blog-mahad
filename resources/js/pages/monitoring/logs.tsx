import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Server } from 'lucide-react';

interface LogsProps {
    logs: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'System Logs',
        href: '/log',
    },
];

export default function Logs({ logs }: LogsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Logs" />

            <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-10">
                {/* Header */}
                <div className="space-y-2">
                    <Heading title="System Logs" description="Pantau log server dan scheduler laravel.log" />
                </div>

                {/* System Logs */}
                <Card className="border-none shadow-lg overflow-hidden flex flex-col">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2 bg-slate-900 text-white rounded-t-lg">
                        <div className="rounded-lg bg-slate-800 p-2 text-green-400">
                            <Server className="h-4 w-4" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold">Log Sistem (Scheduler/Server)</CardTitle>
                            <p className="text-xs text-slate-400">storage/logs/laravel.log</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="bg-[#0D1117] p-4 text-[#E6EDF3] text-xs font-mono overflow-auto max-h-[70vh]">
                            {logs && logs.length > 0 ? (
                                logs.map((line, i) => (
                                    <div key={i} className="whitespace-pre-wrap break-all border-b border-slate-800/50 py-1 hover:bg-slate-800/30">
                                        {line}
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-500 py-10 text-center">Log file kosong atau tidak ditemukan.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
