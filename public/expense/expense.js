// Add Expense Post Request
function expenseform(event) {
    event.preventDefault();
    const expenseDetails = {
        date: event.target.date.value,
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value
      }
    axios
      .post(
        "http://13.236.146.218:5000/expense/add-expense", expenseDetails, { headers: { "Authorization": localStorage.getItem("token") } })
      .then((response) => {
        console.log(response)
        displayExpensesOnScreen(response.data.newExpenseDetail)
      })
      .catch((error) => console.log(error));
  
    // Clearing the input fields
    document.getElementById("date").value = '';
    document.getElementById("amount").value = '';
    document.getElementById("description").value = '';
    document.getElementById("category").value = '';
  }
  
window.addEventListener("DOMContentLoaded", () => {
  rowsPerPage = parseInt(localStorage.getItem("rowsPerPage")) || 3;
  rowsPerPageOption.value = rowsPerPage;
  fetchExpenses(currentPage);
})

const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('previous-btn');
const pageNum = document.getElementById('page-num');
const expensesList = document.getElementById('expenses');
const pagination = document.getElementById('pagination-container');
const rowsPerPageOption = document.getElementById('rows-per-page');

let currentPage = 1;
let rowsPerPage = 3;

// Display expenses on screen
function displayExpensesOnScreen(expenseDetails) {
    expensesList.classList.add("list-group"); 

    // Create a list item for the current expense
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center"); 

    expenseItem.innerHTML = `
        <span>₹${expenseDetails.amount}</span>
        <span>${expenseDetails.description}</span>
        <span>${expenseDetails.category}</span>
        <button class="btn btn-secondary delete-btn btn-sm">x</button>
    `;

    expensesList.appendChild(expenseItem);

    const deleteBtn = expenseItem.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", (event) => {
        axios
          .delete(`http://13.236.146.218:5000/expense/delete-expense/${expenseDetails.id}`, { headers: { "Authorization": localStorage.getItem("token") } })
          .then(() => {
              expenseItem.remove(); 
          })
          .catch((error) => console.log(error));
    });

    // Update the current page when displaying expenses
    currentPage = expenseDetails.currentPage;
    pagination.style.display = 'flex';
}

nextButton.addEventListener('click', () => {
    currentPage += 1;
    fetchExpenses(currentPage);
});

prevButton.addEventListener('click', () => {
    currentPage -= 1;
    fetchExpenses(currentPage);
});

rowsPerPageOption.addEventListener('change', () => {
    rowsPerPage = parseInt(rowsPerPageOption.value);
    localStorage.setItem('rowsPerPage', rowsPerPage);
    fetchExpenses(currentPage);
})

// Function to fetch expenses for a specific page
function fetchExpenses(page) {
    const token = localStorage.getItem('token');
    axios
        .get(`http://13.236.146.218:5000/expense/get-expenses?page=${page}&limit=${rowsPerPage}`, {
            headers: { Authorization: token },
        })
        .then((response) => {
            expensesList.innerHTML = '';
            response.data.allExpenses.forEach(displayExpensesOnScreen);
            const totalPages = response.data.totalPages;
            currentPage = response.data.currentPage;

            if (currentPage === 1) {
                prevButton.disabled = true;
            } else {
                prevButton.disabled = false;
            }

            if (currentPage === 1 && totalPages === 1) {
                nextButton.disabled = true;
                rowsPerPageOption.disabled = false;
            } else if (currentPage !== 1 && totalPages !== 1 && currentPage === totalPages) {
                nextButton.disabled = true;
                rowsPerPageOption.disabled = true;
            } else {
                nextButton.disabled = false;
                rowsPerPageOption.disabled = false;
            }

            const pageNum = document.getElementById('page-num');
            pageNum.textContent = `Page ${currentPage} of ${totalPages}`;
        })
        .catch((error) => console.log(error));
}



const buyPremiumBtn = document.getElementById("rzp-button");
buyPremiumBtn.addEventListener("click", (event) => {
  axios
    .get("http://13.236.146.218:5000/purchase/premiummembership", { headers: { "Authorization": localStorage.getItem("token") } })
    .then((response) => {
        const options = {
          "key": response.data.key_id,
          "order_id": response.data.order.id,
          "handler": function (response) {
            axios
              .post("http://13.236.146.218:5000/purchase/updatetransactionstatus", {
                  order_id: options.order_id,
                  payment_id: response.razorpay_payment_id
              }, { headers: { "Authorization": localStorage.getItem("token") } })
              .then(() => {
                  alert("You are a Premium User!");
                  location.reload();
              })
              .catch((error) => {
                  console.log(error);
              })
            }
          };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();

        rzp1.on("payment.failed", function (response) {
            console.log(response);
            axios
              .post("http://13.236.146.218:5000/purchase/updatetransactionstatus", {
                  order_id: options.order_id,
                  payment_id: response.razorpay_payment_id,
                  error: response.error
              }, { headers: { "Authorization": localStorage.getItem("token") } })
              .then(() => {
                  alert("Something went wrong");
              })
              .catch((error) => {
                  console.log(error);
              })
        })
    })
    .catch((error) => console.log(error));
  })

  const leaderboardBtn = document.getElementById("leaderboard-btn");
  leaderboardBtn.addEventListener("click", (event) => {
    axios
      .get("http://13.236.146.218:5000/premium/leaderboard", { headers: { "Authorization": localStorage.getItem("token") } })
      .then((response) => {
        const leaderboardData = response.data.leaderboard;

        const leaderboardContainer = document.getElementById("leaderboard-container");
        leaderboardContainer.innerHTML = '';
        leaderboardContainer.innerHTML += '<h5>Leaderboard</h5>';

        leaderboardData.forEach((user, index) => {
          leaderboardContainer.innerHTML += `<li>${index + 1}. ${user.username} - ₹${user.totalExpenses}</li>`;
        })          
      })
      .catch((error) => console.log(error));
    })

const downloadBtn = document.getElementById("download-file-btn");
const generateReportLnk = document.getElementById("generate-report-link");
downloadBtn.style.display = "none";

function userPremiumStatus() {
  axios
      .get("http://13.236.146.218:5000/user/status", { headers: { "Authorization": localStorage.getItem("token") } })
      .then((response) => {
          const isPremiumUser = response.data.ispremiumuser;

          if (isPremiumUser) {
              buyPremiumBtn.style.display = "none";
              leaderboardBtn.style.display = "block";
              downloadBtn.style.display = "block";
              generateReportLnk.style.display = "block";

          const premiumMsg = document.createElement("div");
          premiumMsg.classList.add("mb-1", "premium-user-msg");
          premiumMsg.textContent = "You are a Premium User!";
          document.body.appendChild(premiumMsg);
          } else {
              buyPremiumBtn.style.display = "block";
          }
      })
      .catch((error) => console.log(error));
}

userPremiumStatus();

function download() {
  axios
    .get("http://13.236.146.218:5000/user/download", { headers: { "Authorization": localStorage.getItem("token") } })
    .then((response) => {
      if (response.status === 200) {
        let a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = 'MyExpense.csv';
        a.click();
      } else {
          throw new Error(response.data.message);
      }
    })
    .catch((error) => showError(error));
}