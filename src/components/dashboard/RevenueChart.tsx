'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function RevenueChart({ data }: { data: any[] }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-[300px] w-full mt-4 flex items-center justify-center text-muted-foreground">Loading chart...</div>;
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                    <XAxis
                        dataKey="name"
                        stroke={isDark ? '#94a3b8' : '#64748b'}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke={isDark ? '#94a3b8' : '#64748b'}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            color: isDark ? '#f8fafc' : '#0f172a'
                        }}
                        cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }}
                    />
                    <Bar
                        dataKey="revenue"
                        fill={isDark ? '#3b82f6' : '#2563eb'}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
