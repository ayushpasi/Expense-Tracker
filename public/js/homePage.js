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
  alert("save");
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

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/expense/getAllExpenses", {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log("fetched:" + res.data);
      var data = res.data;
      data.forEach((item) => {
        addRowsToTable(item);
      });
    })
    .catch((err) => {
      console.log("Error fetching data:", err);
    });
});
