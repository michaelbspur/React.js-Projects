let rawTransactionsData = [
    {
        "date": "2021-01-01T05:00:00.000Z",
        "Time (Hr)": 9.03,
        "Genre": 'rent/mortgage'
    },
    {
        "date": "2021-02-02T05:00:00.000Z",
        "Time (Hr)": 6.25,
        "Genre": 'order out'
    },
    {
        "date": "2021-03-03T05:00:00.000Z",
        "Time (Hr)": 6.25,
        "Genre": 'order out'
    },
    {
        "date": "2021-04-04T05:00:00.000Z",
        "Time (Hr)": 6.25,
        "Genre": 'order out'
    },
    {
        "date": "2021-05-02T05:00:00.000Z",
        "Time (Hr)": 6.25,
        "Genre": 'order out'
    },
    {
        "date": "2021-06-06T06:00:00.000Z",
        "Time (Hr)": 6.25,
        "Genre": 'order out'
    },
    {
        "date": "2021-07-07T06:00:00.000Z",
        "Time (Hr)": 6.25,
        "Genre": 'order out'
    },
    {
        "date": "2021-08-08T06:00:00.000Z",
        "Time (Hr)": 6.25,
        "Genre": 'order out'
    },
    {
        "date": "2021-09-09T06:00:00.000Z",
        "Time (Hr)": 6.25,
        "Genre": 'order out'
    },
    {
        "date": "2021-10-10T06:00:00.000Z",
        "Time (Hr)": 6.25,
        "Genre": 'order out'
    },
    {
        "date": "2021-11-30T05:00:00.000Z",
        "Time (Hr)": 2.21,
        "Genre": 'rent/mortgage'
    },
    {
        "date": "2021-12-31T05:00:00.000Z",
        "Time (Hr)": 7.37,
        "Genre": 'order out'
    }
];

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

let report = parseOutMonthlyTransactionsReport(rawTransactionsData);
let jsonReport = JSON.stringify(report.months, null, 2);

console.log(jsonReport); 