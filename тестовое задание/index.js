document.addEventListener("DOMContentLoaded", function () {
  // Инициализация базы данных
  const DB_NAME = "FinanceTrackerDB";
  const DB_VERSION = 1;
  const INCOME_STORE = "income";
  const EXPENSE_STORE = "expense";

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
    // Элементы интерфейса
    const addIncomeBtn = document.getElementById("add-income");
    const addExpenseBtn = document.getElementById("add-expense");
    const applyFilterBtn = document.getElementById("apply-filter");
    const resetFilterBtn = document.getElementById("reset-filter");
    const modal = document.getElementById("modal");
    const closeModalBtn = document.querySelector(".close");
    const cancelBtn = document.querySelector(".cancel-btn");
    const transactionForm = document.getElementById("transaction-form");
    const tabButtons = document.querySelectorAll(".tab-button");

    // Установка текущей даты по умолчанию
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    document.getElementById("start-date").valueAsDate = firstDayOfMonth;
    document.getElementById("end-date").valueAsDate = lastDayOfMonth;

    // Загрузка данных
    loadTransactions();

    // Обработчики событий
    addIncomeBtn.addEventListener("click", () =>
      openModal(INCOME_STORE, "Добавить доход")
    );
    addExpenseBtn.addEventListener("click", () =>
      openModal(EXPENSE_STORE, "Добавить расход")
    );

    applyFilterBtn.addEventListener("click", loadTransactions);
    resetFilterBtn.addEventListener("click", resetFilters);

    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    transactionForm.addEventListener("submit", handleFormSubmit);

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active");
        });

        document
          .getElementById(`${button.dataset.tab}-tab`)
          .classList.add("active");
      });
    });

    // Функции

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
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      loadStoreTransactions(INCOME_STORE, "income-table", startDate, endDate);
      loadStoreTransactions(EXPENSE_STORE, "expense-table", startDate, endDate);
      updateSummary();
    }

    function loadStoreTransactions(storeName, tableId, startDate, endDate) {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = function () {
        let transactions = request.result;

        if (startDate && endDate) {
          transactions = transactions.filter((t) => {
            const transDate = new Date(t.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return transDate >= start && transDate <= end;
          });
        }

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderTable(tableId, transactions, storeName);
      };
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

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU");
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

    function updateSummary() {
      calculateTotal(INCOME_STORE, "total-income");
      calculateTotal(EXPENSE_STORE, "total-expense");

      // Обновление баланса
      const income =
        parseFloat(document.getElementById("total-income").textContent) || 0;
      const expense =
        parseFloat(document.getElementById("total-expense").textContent) || 0;
      document.getElementById("balance").textContent =
        (income - expense).toFixed(2) + " ₽";
    }

    function calculateTotal(storeName, elementId) {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = function () {
        const transactions = request.result;
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;

        let filteredTransactions = transactions;

        if (startDate && endDate) {
          filteredTransactions = transactions.filter((t) => {
            const transDate = new Date(t.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return transDate >= start && transDate <= end;
          });
        }

        const total = filteredTransactions.reduce(
          (sum, t) => sum + t.amount,
          0
        );
        document.getElementById(elementId).textContent =
          total.toFixed(2) + " ₽";
      };
    }

    function resetFilters() {
      document.getElementById("start-date").valueAsDate = firstDayOfMonth;
      document.getElementById("end-date").valueAsDate = lastDayOfMonth;
      loadTransactions();
    }
  }
});
