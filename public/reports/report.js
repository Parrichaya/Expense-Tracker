function displayExpenseReport(expensesData, type) {
    const expenseTableBody = document.getElementById('expenseTableBody');
    const expenseTable = document.getElementById('expenseTable');
    expenseTable.style.display = 'block';
    expenseTableBody.innerHTML = '';    

    let totalAmount = 0;

    expensesData.forEach(expense => {
        const row = `
            <tr>
                <td>${expense.date}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>${expense.amount}</td>                
            </tr>
        `;
        expenseTableBody.innerHTML += row;

        totalAmount += parseInt(expense.amount);                
    });    

    const totalAmountRow = `
        <tr> 
            <td colspan="3" style="text-align: center;"><strong>${type === 'daily' ? 'Total Daily Expense' : 'Total Monthly Expense'}</strong></td>
            <td><strong>${totalAmount}</strong></td>
        </tr>
    `;
    expenseTableBody.innerHTML += totalAmountRow;
}

// window.addEventListener('DOMContentLoaded', () => {
//     const type = localStorage.getItem('reportType');

//     if (type) {
//         const dateOrMonth = localStorage.getItem('reportDateOrMonth'); 
//         generateExpenseReport(type, dateOrMonth);
//     }
// })

function generateExpenseReport(type, dateOrMonth) {
    localStorage.setItem('reportType', type);
    localStorage.setItem('reportDateOrMonth', dateOrMonth);
    axios.post(`http://localhost:5000/reports/report/?type=${type}`, { [type === 'daily' ? 'date' : 'month']: dateOrMonth }, { headers: { "Authorization": localStorage.getItem("token") } })
    .then((response) => {
        const expensesData = response.data.expenses;
        displayExpenseReport(expensesData, type);
    })
    .catch((error) => console.log(error));
}

const dailyReportForm = document.getElementById('dailyReportForm');
dailyReportForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const date = document.getElementById('dateInput').value;
    generateExpenseReport('daily', date)
})

const monthlyReportForm = document.getElementById('monthlyReportForm');
monthlyReportForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const month = document.getElementById('monthInput').value;
    generateExpenseReport('monthly', month)
})

