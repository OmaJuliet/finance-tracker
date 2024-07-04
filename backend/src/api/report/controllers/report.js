'use strict';

/**
 * report controller
*/

// path: src/api/report/controllers/report.js

module.exports = {
  async generate(ctx) {
    const { budgets, incomes, expenses } = ctx.request.body;

    if (!budgets.length && !incomes.length && !expenses.length) {
      return ctx.badRequest('No data available to generate report.');
    }

    // Calculate totals and find max expense
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);

    let maxExpenseCategory = 'N/A';
    let maxExpenseAmount = 0;

    if (expenses.length > 0) {
      const maxExpense = expenses.reduce((max, expense) => (expense.amount > max.amount ? expense : max), expenses[0]);
      maxExpenseCategory = maxExpense.description;
      maxExpenseAmount = maxExpense.amount;
    }

    // Generate personalized report
    let report = 'Based on your data:\n';
    budgets.forEach(budget => {
      report += `Your budget for '${budget.category}' is '${budget.amount}'.\n`;
    });

    if (expenses.length > 0) {
      report += `You are spending more on '${maxExpenseCategory}' than other expenses.\n`;
      report += `You've spent a total of '${totalExpenses}' on expenses while having an inflow/income of '${totalIncomes}' `;

      if (totalExpenses >= totalIncomes) {
        report += ", meaning you're close to spending more than you earned. Oops!🙁. Don't let that happen. \n";
      } else {
        report += ", meaning you've managed to spend less than you earned. Kudos 🎉.\n";
      }
    }

    const createdReport = await strapi.query('api::report.report').create({
      data: { report },
    });

    return ctx.send({ report: createdReport.report });
  },
};
