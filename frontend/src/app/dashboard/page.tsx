'use client'
import SideNav from '@/components/SideNav';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import BarChart from './budget/BarChart';
import PieChart from './budget/PieChart';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Overview = () => {
    const [budgets, setBudgets] = useState<{ category: string; amount: number; }[]>([]);
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    const [incomes, setIncomes] = useState<{ description: string; amount: number; }[]>([]);
    const [expenses, setExpenses] = useState<{ description: string; amount: number; }[]>([]);
    const [report, setReport] = useState('');
    const [user, setUser] = useState<{ username: string, email: string } | null>(null);
    const router = useRouter();
    const chartRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/auth/signin');
        }
    }, [router]);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const res = await axios.get('http://localhost:1337/api/budgets?populate=budget');
                const data = res.data.data.map((budget: any) => ({
                    category: budget.attributes.category,
                    amount: budget.attributes.amount,
                }));
                setBudgets(data);
            } catch (error) {
                console.error('Error fetching budgets:', error);
            }
        };

        const fetchIncomesAndExpenses = async () => {
            try {
                const incomeRes = await axios.get('http://localhost:1337/api/incomes');
                const expenseRes = await axios.get('http://localhost:1337/api/expenses');

                const incomeData = incomeRes.data.data.map((income: any) => ({
                    description: income.attributes.description,
                    amount: income.attributes.amount,
                }));

                const expenseData = expenseRes.data.data.map((expense: any) => ({
                    description: expense.attributes.description,
                    amount: expense.attributes.amount,
                }));

                setIncomes(incomeData);
                setExpenses(expenseData);
            } catch (error) {
                console.error('Error fetching incomes and expenses:', error);
            }
        };

        fetchBudgets();
        fetchIncomesAndExpenses();
    }, []);

    const generateReport = async () => {
        try {
            const res = await axios.post('http://localhost:1337/api/generate-report', {
                budgets,
                incomes,
                expenses,
            });

            setReport(res.data.report);
        } catch (error) {
            console.error('Failed to generate report:', error);
            alert('Failed to generate report');
        }
    };

    const printReport = async () => {
        try {
            const printContent = document.getElementById('report-content')?.innerHTML;
            const chartCanvas = chartRef.current;

            if (printContent && chartCanvas) {
                const canvas = await html2canvas(chartCanvas);
                const chartImage = canvas.toDataURL('image/png');

                const docDefinition = {
                    content: [
                        { text: 'Financial Report', style: 'header' },
                        { image: chartImage, width: 500 },
                        htmlToPdfmake(printContent)
                    ],
                    styles: {
                        header: {
                            fontSize: 18,
                            bold: true,
                            margin: [0, 0, 0, 10]
                        }
                    }
                };

                pdfMake.createPdf(docDefinition).download('financial_report.pdf');
            }
        } catch (error) {
            console.error('Failed to generate PDF:', error);
        }
    };

    const categories = budgets.map(budget => budget.category);
    const amounts = budgets.map(budget => budget.amount);

    return (
        <>
            <main className="flex h-screen">
                <SideNav />

                <div className="container mx-auto py-6 px-8">
                    <section className="w-full flex flex-row justify-between py-4 px-[15px]">
                        <h2 className="text-2xl text-gray-700 font-medium">OVERVIEW</h2>
                        {user && (
                            <p className="mt-4 text-lg">
                                Welcome {user.username ? user.username : user.email}!
                            </p>
                        )}
                        <div>
                            <button onClick={() => setChartType('bar')} className={`mx-2 py-2 px-3 ${chartType === 'bar' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg`}>
                                Bar Chart
                            </button>
                            <button onClick={() => setChartType('pie')} className={`mx-2 py-2 px-3 ${chartType === 'pie' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg`}>
                                Pie Chart
                            </button>
                        </div>
                    </section>

                    {budgets.length === 0 ? (
                        <div className="container mx-auto py-6 flex justify-center">
                            <p className="text-2xl text-gray-700">No budget has been added, so no visuals yet.</p>
                        </div>
                    ) : (
                        <>
                            <section className="mt-5" ref={chartRef}>
                                {chartType === 'bar' ? (
                                    <BarChart categories={categories} amounts={amounts} />
                                ) : (
                                    <PieChart categories={categories} amounts={amounts} />
                                )}
                            </section>
                        </>
                    )}

                    <div className="container mx-auto py-5 flex justify-center">
                        <button
                            onClick={generateReport}
                            className="bg-teal-500 text-white py-2 px-4 rounded-lg"
                        >
                            Generate Report
                        </button>
                    </div>

                    {report && (
                        <div className="mb-10 p-5 bg-gray-100 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Financial Report</h3>
                            <div id="report-content" dangerouslySetInnerHTML={{ __html: report }}></div>
                            <button
                                onClick={printReport}
                                className="mt-4 bg-teal-500 text-white py-2 px-4 rounded-lg"
                            >
                                Export as PDF
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Overview;
