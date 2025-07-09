// Handle expense form submission
document.getElementById("expenseForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!amount || !description || !category || !date) {
    return alert("All fields are required.");
  }

  try {
    const response = await fetch("/add-expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description, category, date })
    });

    const data = await response.json();
    alert(data.message);

    if (response.status === 200) {
      // Clear form
      document.getElementById("expenseForm").reset();
      fetchExpenses(); // Reload expenses
    }
  } catch (error) {
    alert("Error adding expense.");
    console.error(error);
  }
});

// Load expenses on page load
window.onload = fetchExpenses;

// Fetch and display expenses
async function fetchExpenses() {
  try {
    const res = await fetch("/expenses");
    const expenses = await res.json();

    const list = document.getElementById("expenseList");
    list.innerHTML = "";

    expenses.forEach(exp => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${exp.description}</td>
        <td>₹${exp.amount}</td>
        <td>${exp.category}</td>
        <td>${new Date(exp.date).toLocaleDateString()}</td>
        <td>
          <button class="edit-btn" onclick="editExpense(${exp.id})">Edit</button>
          <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
        </td>
      `;

      list.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to load expenses", err);
  }
}

// Delete expense by ID
async function deleteExpense(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  try {
    const res = await fetch(`/expenses/${id}`, {
      method: "DELETE"
    });

    const result = await res.json();
    alert(result.message);
    fetchExpenses(); // Reload the table
  } catch (err) {
    console.error("Failed to delete expense", err);
    alert("Could not delete expense.");
  }
}

// (Optional placeholder for edit functionality)
function editExpense(id) {
  alert("Edit feature not implemented yet.");
}
