import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Target, Download, Calendar } from 'lucide-react';
import { Card } from '../components/Layout';
import { api } from '../services/api';

export const MonthlySummary = ({ user }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchSummary = async () => {
        setLoading(true);
        try {
            // For now, calculate on frontend since backend has placeholder
            const expenses = await api.getExpenses();
            const goals = await api.getGoals();

            const monthlyExpenses = expenses.filter(e => {
                const date = new Date(e.created_at);
                return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
            });

            const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
            const totalIncome = user?.monthly_income || 0;
            const totalSavings = totalIncome - totalExpenses;

            const categoryTotals = {};
            monthlyExpenses.forEach(e => {
                categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
            });
            const topCategory = Object.keys(categoryTotals).length > 0 ? 
                Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b) : 'None';

            const goalContributions = goals.reduce((sum, g) => sum + g.current_saved, 0);

            // Health trend - only months with data, up to 6 months back
            const healthTrend = [];
            const monthsWithData = {};
            
            // Group expenses by month
            expenses.forEach(e => {
                const edate = new Date(e.created_at);
                const monthKey = `${edate.getFullYear()}-${String(edate.getMonth() + 1).padStart(2, '0')}`;
                if (!monthsWithData[monthKey]) {
                    monthsWithData[monthKey] = [];
                }
                monthsWithData[monthKey].push(e);
            });
            
            // Get unique months with data, sorted chronologically
            const availableMonths = Object.keys(monthsWithData).sort();
            const recentMonths = availableMonths.slice(-6); // Get last 6 months with data
            
            recentMonths.forEach(monthKey => {
                const [year, month] = monthKey.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                const monthExpenses = monthsWithData[monthKey];
                const monthExp = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
                const monthInc = totalIncome;
                const savingsRate = monthInc > 0 ? ((monthInc - monthExp) / monthInc) * 100 : 0;
                healthTrend.push({
                    month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
                    savingsRate: Math.max(0, savingsRate)
                });
            })

            setSummary({
                totalIncome,
                totalExpenses,
                totalSavings,
                topCategory,
                goalContributions,
                healthTrend
            });
        } catch (e) {
            console.error("Failed to fetch summary", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [selectedMonth, selectedYear, user]);

    const handleDownloadPDF = async () => {
        try {
            const pdfData = await api.downloadMonthlySummaryPDF(selectedYear, selectedMonth);
            const blob = new Blob([pdfData], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `monthly_summary_${selectedYear}_${selectedMonth}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Failed to download PDF", e);
            alert("Failed to download Monthly Summary");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Monthly Financial Summary</h1>
                    <p style={{ color: 'var(--muted)' }}>Overview of your financial health</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}>
                        {Array.from({length: 12}, (_, i) => (
                            <option key={i+1} value={i+1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
                        {Array.from({length: 5}, (_, i) => (
                            <option key={selectedYear - 2 + i} value={selectedYear - 2 + i}>
                                {selectedYear - 2 + i}
                            </option>
                        ))}
                    </select>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleDownloadPDF}>
                        <Download size={18} /> Download PDF
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }} className="grid-responsive">
                <Card title="Income & Expenses" icon={DollarSign}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total Income</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${summary.totalIncome.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total Expenses</span>
                            <span style={{ fontWeight: 700, color: '#ef4444' }}>${summary.totalExpenses.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total Savings</span>
                            <span style={{ fontWeight: 700, color: summary.totalSavings >= 0 ? 'var(--primary)' : '#ef4444' }}>
                                ${summary.totalSavings.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card title="Spending Insights" icon={BarChart3}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Top Spending Category</span>
                            <span style={{ fontWeight: 700 }}>{summary.topCategory}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Goal Contributions</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${summary.goalContributions.toFixed(2)}</span>
                        </div>
                    </div>
                </Card>

                <Card title="Money Health Trend" icon={TrendingUp}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {summary.healthTrend.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{item.month}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '100px',
                                        height: '8px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${Math.min(100, item.savingsRate)}%`,
                                            height: '100%',
                                            background: item.savingsRate >= 20 ? 'var(--primary)' : '#ef4444',
                                            borderRadius: '4px'
                                        }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.savingsRate.toFixed(1)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};