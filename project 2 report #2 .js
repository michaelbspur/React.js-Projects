class Transaction {
    constructor(date, amount, reason) {
        this.date = date;
        this.amount = amount;
        this.reason = reason;
    }
}
class ReasonPercentage {
    constructor(reason, percentage) {
        this.reason = reason;
        this.percentage = percentage;
    }
}

class MonthlyReport {
    constructor(month, transactionAmountSum, transactionReasonPercentages) {
        this.month = month;
        this.transactionAmountSum = transactionAmountSum;
        this.transactionReasonPercentages = transactionReasonPercentages;
    }
}

function createReasonCache(originalAmount) {
    let reasonCache = new Map();

    return {
        cache: reason => {
            if (reasonCache.has(reason)) {
                reasonCache.set(reason, reasonCache.get(reason) + 1);
            } else {
                reasonCache.set(reason, 1);
            }
        },
        reduce: () => {
            let values = [];

            reasonCache.forEach((count, reason) => {
                values.push(new ReasonPercentage(reason, (count / originalAmount).toFixed(2)));
            });

            return values;
        }
    }
}

function calculateReasonPercentages(monthlyTransactions) {
    let cache = createReasonCache(monthlyTransactions.length);

    for (let i = 0; i < monthlyTransactions.length; i++) {
        cache.cache(monthlyTransactions[i].reason);
    }

    return cache.reduce();
}

function parseOutMonthlyTransactionsReport(rawTransactionsData) {
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const transactions = rawTransactionsData.map(transaction => {
        return new Transaction(new Date(transaction.date), transaction.amount, transaction.reason);
    });

    let monthlyReports = [];

    for (let month = 0; month < months.length; month++) {
        let monthlyTransactions = transactions.filter(transaction => transaction.date.getMonth() == month);
        let reasonPercentages = calculateReasonPercentages(monthlyTransactions);
        let monthlyAmmountSum = monthlyTransactions.reduce((sum, transaction) => sum + transaction.amount, 0).toFixed(2);
        monthlyReports.push(new MonthlyReport(months[month], monthlyAmmountSum, reasonPercentages));
    }

    return { "months": monthlyReports };
}

async function retrieveTransactionReportData() {
    let response = await fetch("https://api.jsonbin.io/b/6073a0670ed6f819bea9461c" {
        headers: {
            "Content-Type": "application/json",
            "secret-key": "$2b$10$s1vBjFqln1F3PwECEsdTn.WlzPw7Xy3UHvlawaCJJ5yPzjqvUSbhu"
        }
    });

    let json = await response.json();
    return parseOutMonthlyTransactionsReport(json["rawTransactionsData"]);
}

function buildMonthlyReportTableDiv(monthlyReport) {
    const container = document.createElement("div");
    const monthHeader = document.createElement("h3");
    const table = document.createElement("table");
    const tableHeader = table.createTHead();

    let month = monthlyReport.month;
    let monthlyTransactionSum = monthlyReport.transactionAmountSum;
    let transactionReasonPercentages = monthlyReport.transactionReasonPercentages;

    monthHeader.innerText = `${month} - $${monthlyTransactionSum}`;

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var headerRow = document.createElement("tr");
    var percentageRow = document.createElement("tr");

    transactionReasonPercentages.sort((a, b) => a.percentage - b.percentage);

    transactionReasonPercentages.forEach(reason => {
        const reasonName = document.createElement("p");
        var th = document.createElement("th");
        reasonName.innerText = reason.reason;
        th.appendChild(reasonName);
        headerRow.appendChild(th);
    });

    transactionReasonPercentages.forEach(reason => {
        const reasonPercentageOfSum = document.createElement("p");
        const reasonPercentage = document.createElement("p");
        reasonPercentage.innerText = (`${reason.percentage}%`);
        reasonPercentageOfSum.innerText = (`$${(monthlyTransactionSum * reason.percentage).toFixed(2)}`);
        var td = document.createElement("td");
        td.appendChild(reasonPercentage);
        td.appendChild(reasonPercentageOfSum);
        percentageRow.appendChild(td);
        tbody.appendChild(percentageRow);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.appendChild(tbody);

    container.appendChild(monthHeader);
    container.appendChild(table);

    document.getElementById("monthly-reports-container").appendChild(container);
}

let reportCache = null;

async function buildTransactionReportTable() {
    if (reportCache == null) {
        reportCache = await retrieveTransactionReportData();
    }

    reportCache.months.forEach(buildMonthlyReportTableDiv);
}

function resetMonthlyReportsContainer() {
    document.getElementById("monthly-reports-container").innerHTML = "";
} 