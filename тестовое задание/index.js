document.addEventListener("DOMContentLoaded", function () {
  const DB_NAME = "FinanceTrackerDB";
  const DB_VERSION = 1;
  const INCOME_STORE = "income";
  const EXPENSE_STORE = "expense";

  let incomeChart;
  let expenseChart;
  let db;

  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    if (!db.objectStoreNames.contains(INCOME_STORE)) {
      db.createObjectStore(INCOME_STORE, {
        keyPath: "id",
        autoIncrement: true,
      });
    }

    if (!db.objectStoreNames.contains(EXPENSE_STORE)) {
      db.createObjectStore(EXPENSE_STORE, {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    initApp();
  };

  request.onerror = function (event) {
    console.error("Database error:", event.target.error);
  };

  function initApp() {
    incomeChart = echarts.init(document.getElementById("income-chart"));
    expenseChart = echarts.init(document.getElementById("expense-chart"));

    const addIncomeBtn = document.getElementById("add-income");
    const addExpenseBtn = document.getElementById("add-expense");
    const applyFilterBtn = document.getElementById("apply-filter");
    const closeModalBtn = document.querySelector(".close");
    const cancelBtn = document.querySelector(".cancel-btn");
    const transactionForm = document.getElementById("transaction-form");

    loadTransactions();

    addIncomeBtn.addEventListener("click", () =>
      openModal(INCOME_STORE, "Добавить доход")
    );
    addExpenseBtn.addEventListener("click", () =>
      openModal(EXPENSE_STORE, "Добавить расход")
    );

    applyFilterBtn.addEventListener("click", loadTransactions);

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    transactionForm.addEventListener("submit", handleFormSubmit);
  }

  function openModal(type, title, transaction = null) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("edit-type").value = type;

    if (transaction) {
      document.getElementById("edit-id").value = transaction.id;
      document.getElementById("category").value = transaction.category;
      document.getElementById("amount").value = transaction.amount;
      document.getElementById("date").value = transaction.date;
    } else {
      document.getElementById("edit-id").value = "";
      document.getElementById("category").value = "";
      document.getElementById("amount").value = "";
      document.getElementById("date").valueAsDate = new Date();
    }

    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const transaction = {
      category: document.getElementById("category").value,
      amount: parseFloat(document.getElementById("amount").value),
      date: document.getElementById("date").value,
    };

    const id = document.getElementById("edit-id").value;
    const type = document.getElementById("edit-type").value;

    if (id) {
      transaction.id = parseInt(id);
      updateTransaction(type, transaction);
    } else {
      addTransaction(type, transaction);
    }

    closeModal();
  }

  function loadTransactions() {
    loadStoreTransactions(INCOME_STORE, "income-table");
    loadStoreTransactions(EXPENSE_STORE, "expense-table");
    updateCharts();
  }

  function loadStoreTransactions(storeName, tableId) {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = function () {
      const transactions = filterTransactionsByDate(request.result);
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      renderTable(tableId, transactions, storeName);
    };
  }
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  }
  function renderTable(tableId, transactions, storeName) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = "";

    transactions.forEach((transaction) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${transaction.category}</td>
        <td>${transaction.amount.toFixed(2)} ₽</td>
        <td>${formatDate(transaction.date)}</td>
        <td>
          <button class="action-btn edit-btn" data-id="${
            transaction.id
          }">Изменить</button>
          <button class="action-btn delete-btn" data-id="${
            transaction.id
          }">Удалить</button>
        </td>
      `;

      row.querySelector(".edit-btn").addEventListener("click", () => {
        openModal(
          storeName,
          storeName === INCOME_STORE ? "Изменить доход" : "Изменить расход",
          transaction
        );
      });

      row.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("Вы уверены, что хотите удалить эту запись?")) {
          deleteTransaction(storeName, transaction.id);
        }
      });

      tbody.appendChild(row);
    });
  }

  function updateCharts() {
    updateChart(INCOME_STORE, incomeChart, "Доходы по категориям");
    updateChart(EXPENSE_STORE, expenseChart, "Расходы по категориям");
  }

  function updateChart(storeName, chartInstance, title) {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = function () {
      const transactions = filterTransactionsByDate(request.result);
      const categories = {};

      transactions.forEach((item) => {
        if (!categories[item.category]) {
          categories[item.category] = 0;
        }
        categories[item.category] += item.amount;
      });

      const option = {
        title: {
          text: title,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ₽ ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: Object.keys(categories),
        },
        series: [
          {
            name: title,
            type: "pie",
            radius: "50%",
            data: Object.entries(categories).map(([name, value]) => ({
              name,
              value,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              formatter: "{b}: {c} ₽",
            },
          },
        ],
      };

      chartInstance.setOption(option);
    };
  }

  function filterTransactionsByDate(transactions) {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    if (startDate && endDate) {
      return transactions.filter((t) => {
        const transDate = new Date(t.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transDate >= start && transDate <= end;
      });
    }
    return transactions;
  }

  function addTransaction(storeName, transaction) {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.add(transaction);

    request.onsuccess = function () {
      loadTransactions();
    };
  }

  function updateTransaction(storeName, transaction) {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.put(transaction);

    request.onsuccess = function () {
      loadTransactions();
    };
  }

  function deleteTransaction(storeName, id) {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = function () {
      loadTransactions();
    };
  }
});
