// Code templates for Dynamic Programming & Greedy Visualizer

export const getDPCodeTemplate = (lang, algo) => {
  // Normalize language first
  if (lang) {
    let l = lang.toLowerCase();
    if (l === 'java') lang = 'Java';
    else if (l === 'cpp' || l === 'c++') lang = 'C++';
    else if (l === 'python') lang = 'Python';
    else if (l === 'js' || l === 'javascript') lang = 'JS';
  }
  
  if (algo === 'LCS') {
    if (lang === 'C++') {
      return `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int lcs(string X, string Y) {
    int m = X.length();
    int n = Y.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (X[i - 1] == Y[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}

int main() {
    string X = "ABCDGH";
    string Y = "AEDFHR";
    cout << "Length of LCS is " << lcs(X, Y) << endl;
    return 0;
}`;
    } else if (lang === 'Java') {
      return `import java.util.*;

public class LCS {
    public static int lcs(String X, String Y) {
        int m = X.length();
        int n = Y.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (X.charAt(i - 1) == Y.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }

    public static void main(String[] args) {
        String X = "ABCDGH";
        String Y = "AEDFHR";
        System.out.println("Length of LCS is " + lcs(X, Y));
    }
}`;
    } else if (lang === 'Python') {
      return `def lcs(X, Y):
    m = len(X)
    n = len(Y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i - 1] == Y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n]

if __name__ == "__main__":
    X = "ABCDGH"
    Y = "AEDFHR"
    print("Length of LCS is", lcs(X, Y))`;
    } else { // JS
      return `function lcs(X, Y) {
    const m = X.length;
    const n = Y.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (X[i - 1] === Y[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}

// Execution
const X = "ABCDGH";
const Y = "AEDFHR";
console.log("Length of LCS is", lcs(X, Y));`;
    }
  }

  if (algo === 'LIS') {
    if (lang === 'C++') {
      return `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int lis(vector<int>& arr) {
    int n = arr.size();
    if (n == 0) return 0;
    vector<int> dp(n, 1);
    int max_lis = 1;

    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
            }
        }
        max_lis = max(max_lis, dp[i]);
    }
    return max_lis;
}

int main() {
    vector<int> arr = {10, 22, 9, 33, 21, 50, 41, 60};
    cout << "Length of LIS is " << lis(arr) << endl;
    return 0;
}`;
    } else if (lang === 'Java') {
      return `import java.util.*;

public class LIS {
    public static int lis(int[] arr) {
        int n = arr.length;
        if (n == 0) return 0;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        int max = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
                    dp[i] = dp[j] + 1;
                }
            }
            max = Math.max(max, dp[i]);
        }
        return max;
    }

    public static void main(String[] args) {
        int[] arr = {10, 22, 9, 33, 21, 50, 41, 60};
        System.out.println("Length of LIS is " + lis(arr));
    }
}`;
    } else if (lang === 'Python') {
      return `def lis(arr):
    n = len(arr)
    if n == 0:
        return 0
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(0, i):
            if arr[i] > arr[j] and dp[i] < dp[j] + 1:
                dp[i] = dp[j] + 1
                
    return max(dp)

if __name__ == "__main__":
    arr = [10, 22, 9, 33, 21, 50, 41, 60]
    print("Length of LIS is", lis(arr))`;
    } else { // JS
      return `function lis(arr) {
    const n = arr.length;
    if (n === 0) return 0;
    const dp = Array(n).fill(1);
    let maxLen = 1;

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[i] > arr[j] && dp[i] < dp[j] + 1) {
                dp[i] = dp[j] + 1;
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    return maxLen;
}

// Execution
const arr = [10, 22, 9, 33, 21, 50, 41, 60];
console.log("Length of LIS is", lis(arr));`;
    }
  }

  if (algo === 'Knapsack') {
    if (lang === 'C++') {
      return `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 1. 0/1 Knapsack (Dynamic Programming)
int knapsack01(int W, const vector<int>& wt, const vector<int>& val, int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w)
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}

// 2. Fractional Knapsack (Greedy Approach)
struct Item {
    int value, weight;
    Item(int v, int w) : value(v), weight(w) {}
};

bool compareItems(Item a, Item b) {
    double r1 = (double)a.value / a.weight;
    double r2 = (double)b.value / b.weight;
    return r1 > r2;
}

double fractionalKnapsack(int W, vector<Item>& items) {
    sort(items.begin(), items.end(), compareItems);
    double finalVal = 0.0;
    int currWeight = 0;

    for (int i = 0; i < items.size(); i++) {
        if (currWeight + items[i].weight <= W) {
            currWeight += items[i].weight;
            finalVal += items[i].value;
        } else {
            int remain = W - currWeight;
            finalVal += items[i].value * ((double)remain / items[i].weight);
            break;
        }
    }
    return finalVal;
}

int main() {
    vector<int> val = {60, 100, 120};
    vector<int> wt = {10, 20, 30};
    int W = 50;
    int n = val.size();

    cout << "DP 0/1 Knapsack Max Value: " << knapsack01(W, wt, val, n) << endl;

    vector<Item> items = { Item(60, 10), Item(100, 20), Item(120, 30) };
    cout << "Greedy Fractional Knapsack Max Value: " << fractionalKnapsack(W, items) << endl;
    return 0;
}`;
    } else if (lang === 'Java') {
      return `import java.util.*;

public class KnapsackDemo {
    // 1. 0/1 Knapsack (DP)
    public static int knapsack01(int W, int[] wt, int[] val, int n) {
        int[][] dp = new int[n + 1][W + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                if (wt[i - 1] <= w) {
                    dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][W];
    }

    // 2. Fractional Knapsack (Greedy)
    static class Item {
        int value, weight;
        Item(int val, int wt) { this.value = val; this.weight = wt; }
    }

    public static double fractionalKnapsack(int W, Item[] items) {
        Arrays.sort(items, (a, b) -> {
            double r1 = (double)a.value / a.weight;
            double r2 = (double)b.value / b.weight;
            return Double.compare(r2, r1); // Descending order
        });

        double finalVal = 0.0;
        int currWeight = 0;

        for (Item item : items) {
            if (currWeight + item.weight <= W) {
                currWeight += item.weight;
                finalVal += item.value;
            } else {
                int remain = W - currWeight;
                finalVal += item.value * ((double)remain / item.weight);
                break;
            }
        }
        return finalVal;
    }

    public static void main(String[] args) {
        int[] val = {60, 100, 120};
        int[] wt = {10, 20, 30};
        int W = 50;

        System.out.println("DP 0/1 Knapsack Max Value: " + knapsack01(W, wt, val, val.length));

        Item[] items = { new Item(60, 10), new Item(100, 20), new Item(120, 30) };
        System.out.println("Greedy Fractional Knapsack Max Value: " + fractionalKnapsack(W, items));
    }
}`;
    } else if (lang === 'Python') {
      return `def knapsack01(W, wt, val, n):
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i - 1] <= w:
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]

class Item:
    def __init__(self, value, weight):
        self.value = value
        self.weight = weight

def fractionalKnapsack(W, items):
    items.sort(key=lambda x: x.value / x.weight, reverse=True)
    finalVal = 0.0
    currWeight = 0

    for item in items:
        if currWeight + item.weight <= W:
            currWeight += item.weight
            finalVal += item.value
        else:
            remain = W - currWeight
            finalVal += item.value * (remain / item.weight)
            break
    return finalVal

if __name__ == "__main__":
    val = [60, 100, 120]
    wt = [10, 20, 30]
    W = 50
    print("DP 0/1 Knapsack Max Value:", knapsack01(W, wt, val, len(val)))

    items = [Item(60, 10), Item(100, 20), Item(120, 30)]
    print("Greedy Fractional Knapsack Max Value:", fractionalKnapsack(W, items))`;
    } else { // JS
      return `// 1. 0/1 Knapsack (Dynamic Programming)
function knapsack01(W, wt, val, n) {
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}

// 2. Fractional Knapsack (Greedy Approach)
function fractionalKnapsack(W, items) {
    // Sort items by value/weight ratio descending
    items.sort((a, b) => (b.val / b.wt) - (a.val / a.wt));
    let finalVal = 0.0;
    let currWeight = 0;

    for (let item of items) {
        if (currWeight + item.wt <= W) {
            currWeight += item.wt;
            finalVal += item.val;
        } else {
            let remain = W - currWeight;
            finalVal += item.val * (remain / item.wt);
            break;
        }
    }
    return finalVal;
}

// Execution
const val = [60, 100, 120];
const wt = [10, 20, 30];
const W = 50;
console.log("DP 0/1 Knapsack Max Value:", knapsack01(W, wt, val, val.length));

const items = [{ val: 60, wt: 10 }, { val: 100, wt: 20 }, { val: 120, wt: 30 }];
console.log("Greedy Fractional Knapsack Max Value:", fractionalKnapsack(W, items));`;
    }
  }

  if (algo === 'CoinChange') {
    if (lang === 'C++') {
      return `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 1. Coin Change (Dynamic Programming)
int coinChangeDP(const vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

// 2. Coin Change (Greedy Approach - May fail or be suboptimal)
int coinChangeGreedy(vector<int> coins, int amount, vector<int>& selectedCoins) {
    sort(coins.rbegin(), coins.rend()); // Sort descending
    int count = 0;
    for (int coin : coins) {
        while (amount >= coin) {
            amount -= coin;
            selectedCoins.push_back(coin);
            count++;
        }
    }
    return amount == 0 ? count : -1;
}

int main() {
    vector<int> coins = {1, 3, 4};
    int amount = 6;
    
    cout << "DP Min Coins required: " << coinChangeDP(coins, amount) << endl;
    
    vector<int> selected;
    int greedyCount = coinChangeGreedy(coins, amount, selected);
    cout << "Greedy Min Coins required: " << greedyCount;
    if (greedyCount != -1) {
        cout << " (Selected: ";
        for (int c : selected) cout << c << " ";
        cout << ")";
    }
    cout << endl;
    return 0;
}`;
    } else if (lang === 'Java') {
      return `import java.util.*;

public class CoinChangeDemo {
    // 1. Coin Change (Dynamic Programming)
    public static int coinChangeDP(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    // 2. Coin Change (Greedy - May fail or be suboptimal)
    public static int coinChangeGreedy(int[] coins, int amount, List<Integer> selectedCoins) {
        Integer[] descendingCoins = Arrays.stream(coins).boxed().toArray(Integer[]::new);
        Arrays.sort(descendingCoins, Collections.reverseOrder());

        int count = 0;
        for (int coin : descendingCoins) {
            while (amount >= coin) {
                amount -= coin;
                selectedCoins.add(coin);
                count++;
            }
        }
        return amount == 0 ? count : -1;
    }

    public static void main(String[] args) {
        int[] coins = {1, 3, 4};
        int amount = 6;

        System.out.println("DP Min Coins required: " + coinChangeDP(coins, amount));

        List<Integer> selected = new ArrayList<>();
        int greedyCount = coinChangeGreedy(coins, amount, selected);
        System.out.print("Greedy Min Coins required: " + greedyCount);
        if (greedyCount != -1) {
            System.out.print(" (Selected: " + selected + ")");
        }
        System.out.println();
    }
}`;
    } else if (lang === 'Python') {
      return `def coinChangeDP(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
                
    return dp[amount] if dp[amount] <= amount else -1

def coinChangeGreedy(coins, amount):
    sorted_coins = sorted(coins, reverse=True)
    count = 0
    selected = []
    
    for coin in sorted_coins:
        while amount >= coin:
            amount -= coin
            selected.append(coin)
            count += 1
            
    return count if amount == 0 else -1, selected

if __name__ == "__main__":
    coins = [1, 3, 4]
    amount = 6
    print("DP Min Coins required:", coinChangeDP(coins, amount))
    
    greedyCount, selected = coinChangeGreedy(coins, amount)
    print("Greedy Min Coins required:", greedyCount, "Selected:", selected)`;
    } else { // JS
      return `// 1. Coin Change (Dynamic Programming)
function coinChangeDP(coins, amount) {
    const dp = Array(amount + 1).fill(amount + 1);
    dp[0] = 0;

    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

// 2. Coin Change (Greedy Approach)
function coinChangeGreedy(coins, amount) {
    const sortedCoins = [...coins].sort((a, b) => b - a);
    let count = 0;
    const selected = [];

    for (let coin of sortedCoins) {
        while (amount >= coin) {
            amount -= coin;
            selected.push(coin);
            count++;
        }
    }
    return amount === 0 ? { count, selected } : { count: -1, selected: [] };
}

// Execution
const coins = [1, 3, 4];
const amount = 6;
console.log("DP Min Coins required:", coinChangeDP(coins, amount));

const greedyRes = coinChangeGreedy(coins, amount);
console.log("Greedy Min Coins required:", greedyRes.count, "Selected:", greedyRes.selected);`;
    }
  }

  return '';
};
