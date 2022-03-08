let MonthlyTransaction = [
    {
        "date": "2020-01-01",
        "amount": 1090,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-01-03",
        "amount": 199.43,
        "reason": 'Groceries/Needs'
    },

    {
        "date": "2020-02-01",
        "amount": 1877,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-02-03",
        "amount": 140.98,
        "reason": 'Groceries/Needs'
    },
    {
        "date": "2020-02-06",
        "amount": 245,
        "reason": 'Gym,/Subscripions'
    },


    {
        "date": "2020-03-01",
        "amount": 2000.86,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-03-03",
        "amount": 167,
        "reason": 'Groceries/Needs'
    },

    {
        "date": "2020-04-01",
        "amount": 9866,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-04-03",
        "amount": 85,
        "reason": 'Groceries/Needs'
    },

    {
        "date": "2020-05-01",
        "amount": 7900,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-05-03",
        "amount": 2001,
        "reason": 'Groceries/Needs'
    },

    {
        "date": "2020-06-01",
        "amount": 9341,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-06-03",
        "amount": 140,
        "reason": 'Groceries/Needs'
    },

    {
        "date": "2020-07-01",
        "amount": 9113,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-07-03",
        "amount": 200,
        "reason": 'Groceries/Needs'
    },
    {
        "date": "2020-07-20",
        "amount": 8000,
        "reason": 'Summer Vacation'
    },

    {
        "date": "2020-08-01",
        "amount": 9433,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-08-03",
        "amount": 900,
        "reason": 'Groceries/Needs'
    },
    {
        "date": "2020-08-07",
        "amount": 140,
        "reason": 'Gym,/Subscripions'
    },


    {
        "date": "2020-09-01",
        "amount": 9343,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-09-03",
        "amount": 176,
        "reason": 'Groceries/Needs'
    },
    

    {
        "date": "2020-10-01",
        "amount": 9123,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-10-03",
        "amount": 709,
        "reason": 'Groceries/Needs'
    },
    {
        "date": "2020-10-30",
        "amount": 90,
        "reason": 'Halloween Candy'
    },  

    {
        "date": "2020-11-01",
        "amount": 9863,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-11-03",
        "amount": 134,
        "reason": 'Groceries/Needs'
    },
    {
        "date": "2020-011-07",
        "amount": 140,
        "reason": 'Gym,/Subscripions'
    },
    {
        "date": "2020-011-07",
        "amount": 620,
        "reason": 'Thanksgiving meal'
    },


    {
        "date": "2020-12-01",
        "amount": 9003,
        "reason": 'Housing/Transportation'
    },
    {
        "date": "2020-12-03",
        "amount": 600,
        "reason": 'Groceries/Needs'
    },  
    {
        "date": "2020-12-24",
        "amount": 1800,
        "reason": 'Christmas Gifts'
    },  
];


class Transaction 
{
    constructor(date, amount, reason) 
    {
        this.date = date;
        this.amount = amount;
        this.reason = reason;
    }
}
class PercenteOFTransaction 
{
    constructor(reason, percentage) 
    {
        this.reason = reason;
        this.percentage = percentage;
    }
}

class MonthlyReport 
{
    constructor(month, TotalAmount, Percentage) 
    {
        this.month = month;
        this.TotalAmount = TotalAmount;
        this.Percentage = Percentage;
    }
}

function reason(OAmount) 
{
    let ReasonC = new Map();

    return {
        cache: reason => 
        {
            if (ReasonC.has(reason)) 
            {
                ReasonC.set(reason, ReasonC.get(reason) + 1);
            } else {
                ReasonC.set(reason, 1);
            }
        },
        reduce: () => 
        {
            let values = [];

            ReasonC.forEach((count, reason) => 
            {
                values.push(new PercenteOFTransaction(reason, (count / OAmount).toFixed(2)));
            });

            return values;
        }
    }
}

function Percentages(monthlyTransactions) 
{
    let cache = reason(monthlyTransactions.length);

    for (let i = 0; i < monthlyTransactions.length; i++) 
    {
        cache.cache(monthlyTransactions[i].reason);
    }

    return cache.reduce();
}

function MOnthlyReport(Transactionspermonth) 
{
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    const transactions = Transactionspermonth.map(transaction => 
    {
        return new Transaction(new Date(transaction.date), transaction.amount, transaction.reason);
    });

    let monthlyReports=[];

    for (let month = 0; month < months.length; month++) 
    {
        let monthlyTransactions = transactions.filter(transaction => transaction.date.getMonth() == month);

        let reasonPercentages = Percentages(monthlyTransactions);
        
        let monthlyAmmountSum = monthlyTransactions.reduce((sum, transaction) => sum + transaction.amount, 0).toFixed(2);

        monthlyReports.push(new MonthlyReport(months[month], monthlyAmmountSum, reasonPercentages));
    }

    return { "months": monthlyReports };
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