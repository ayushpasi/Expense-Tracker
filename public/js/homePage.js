// Function to add rows to the table
const token = localStorage.getItem("token");
function addRowsToTable(expense) {
  var tbody = document.getElementById("expenseTableBody");
  var tableContent = "";

  tableContent += `<tr>
    <td>${expense.expenseAmount}</td>
    <td>${expense.expenseDescription}</td>
    <td>${expense.expenseCategory}</td>
    <td>
      <button class="btn-delete" onclick="deleteRow(this,${expense.id})">Delete</button>
      <button class="btn-update" onclick="updateRow(this)">Update</button>
    </td>
  </tr>`;

  tbody.innerHTML += tableContent;
}

// Functions for delete and update
async function deleteRow(btn, expenseId) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/expense/deleteExpense/${expenseId}`,
      { headers: { Authorization: token } }
    );
    console.log("Expense deleted:", response.data);
    // Handle success if needed
  } catch (error) {
    console.error("Error deleting expense:", error);
    // Handle error if needed
  }
  console.log(expenseId);
  var row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function updateRow(btn) {
  // Implement update logic here
  // For example, you can access the row and modify its content
  var row = btn.parentNode.parentNode;
  // Perform update operations
}

async function addNewExpense(e) {
  e.preventDefault();
  let expenseAmount = e.target.expenseAmount.value;
  let expenseDescription = e.target.expenseDescription.value;
  let expenseCategory = e.target.expenseCategory.value;
  let expense = {
    expenseAmount: expenseAmount,
    expenseDescription: expenseDescription,
    expenseCategory: expenseCategory,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/expense/addExpense",
      expense,
      { headers: { Authorization: token } }
    );
    console.log(response.data.expense);
    // Assuming the server sends back the newly created expense
    addRowsToTable(response.data.expense);
  } catch (error) {
    console.error(error);
  }
}
const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  if (decodedToken.isPremiumUser) {
    document.getElementById("rzp-button1").style.display = "none";
    document.getElementById("message").innerHTML = "You are a premium user now";
    displayLeaderboard();
    document.getElementById("downloadexpense").style.display = "block";
  }
  getAllExpenses();
});

async function buyPremium(e) {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:3000/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );
  var options = {
    key: res.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: res.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      console.log(res);

      // alert(
      //   "Welcome to our Premium Membership, You have now access to Reports and LeaderBoard"
      // );
      document.getElementById("rzp-button1").style.display = "none";
      document.getElementById("message").innerHTML =
        "You are a premium user now";
      localStorage.setItem("token", res.data.token);
      displayLeaderboard();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", (response) => {
    console.log(response.error.code);
    console.log(response.error.description);
    alert(`Something went wrong`);
  });
}

// Function to fetch leaderboard data using Axios
async function fetchLeaderboardData() {
  try {
    const response = await axios.get(
      "http://localhost:3000/premium/showLeaderBoard",
      { headers: { Authorization: token } }
    );
    return response.data.userLeaderboardDetails;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

// Display leaderboard function
async function displayLeaderboard() {
  const leaderboardButton = document.getElementById("showLeaderBoard");
  leaderboardButton.style.display = "block";

  leaderboardButton.addEventListener("click", async () => {
    document.getElementById("leaderboardContainer").style.display = "block";
    const leaderboardBody = document.getElementById("leaderboardBody");
    leaderboardBody.innerHTML = ""; // Clear previous content

    try {
      const userLeaderboardDetails = await fetchLeaderboardData();

      userLeaderboardDetails.forEach((user, index) => {
        const row = document.createElement("tr");

        const rankCell = document.createElement("td");
        rankCell.textContent = index + 1;

        const nameCell = document.createElement("td");
        nameCell.textContent = user.name;

        const costCell = document.createElement("td");
        costCell.textContent = user.totalExpense;

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(costCell);

        leaderboardBody.appendChild(row);
      });
      leaderboardButton.style.display = "none";
    } catch (error) {
      console.error("Error displaying leaderboard:", error);
    }
  });

  // Add the button to the DOM
  document.body.appendChild(leaderboardButton);
}

const download = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("http://localhost:3000/user/download", {
      headers: { Authorization: token },
    });
    if (response.status === 200) {
      var a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.log(err);
  }
};

async function getAllExpenses() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:3000/expense/getAllExpenses/1",
      { headers: { Authorization: token } }
    );

    const table = document.getElementById("expenseTableBody"); // Assuming you have a tbody with id="expenseTableBody"
    table.innerHTML = ""; // Clear the table before populating with new data

    res.data.expenses.forEach((expense) => {
      addRowsToTable(expense);
    });

    const ul = document.getElementById("paginationUL");
    ul.innerHTML = ""; // Clear the pagination before re-creating

    for (let i = 1; i <= res.data.totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      li.setAttribute("class", "page-item");
      a.setAttribute("class", "page-link");
      a.setAttribute("href", "#");
      a.appendChild(document.createTextNode(i));
      li.appendChild(a);
      ul.appendChild(li);
      a.addEventListener("click", paginationBtn);
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

async function paginationBtn(e) {
  try {
    const pageNo = e.target.textContent;
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:3000/expense/getAllExpenses/${pageNo}`,
      { headers: { Authorization: token } }
    );

    const table = document.getElementById("expenseTableBody");
    table.innerHTML = ""; // Clear the table before populating with new data

    res.data.expenses.forEach((expense) => {
      addRowsToTable(expense);
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}
