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

    let report = '';

    // Analyze and generate the report string for budget data
    if (budgets.length > 0) {
        report += 'Based on your data: ';
        budgets.forEach(budget => {
            report += `your budget for '${budget.category}' is '${budget.amount}'. `;
        });
        report += '<br>';
    }


    // To generate report for income and expenses
    // if (expenses.length > 0) {
    //   report += `You are spending more on <strong>${maxExpenseCategory}</strong> than other expenses. <br>`;
    //   if (totalExpenses >= totalIncomes) {
    //     report += `You've spent a total of <strong>$${totalExpenses}</strong> on expenses while having an inflow/income of <strong>$${totalIncomes}</strong>, meaning you've spent more than you earned. Oops!🙁. <br>`;
    //   } else {
    //     report += `You've spent a total of <strong>$${totalExpenses}</strong> on expenses while having an inflow/income of <strong>$${totalIncomes}</strong>, meaning you managed to spend less than you earned. Kudos 🎉. <br>`;
    //   }
    // }

    const createdReport = await strapi.query('api::report.report').create({
      data: { report },
    });

    return ctx.send({ report: createdReport.report });
  },
};
