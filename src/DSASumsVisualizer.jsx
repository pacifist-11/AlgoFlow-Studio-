/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import CodeRunnerModal from './CodeRunnerModal.jsx';
import { toFullExecutableProgram } from './DSANotesVisualizer.jsx';
import { isLineDebuggerSupported } from './languageUtils.js';

// Allman brace formatter
const toAllman = code => {
  if (!code) return '';
  const lines = code.split('\n');
  const out = [];
  for (const line of lines) {
    const t = line.trimEnd();
    if (t.endsWith('{') && t.trim() !== '{' && !t.trim().startsWith('//') && !t.trim().startsWith('*')) {
      const indent = line.match(/^(\s*)/)[1];
      const body = t.slice(0, -1).trimEnd();
      if (body.trim().length > 0) { out.push(body); out.push(indent + '{'); continue; }
    }
    out.push(line);
  }
  return out.join('\n');
};

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (err) {
    document.body.removeChild(textArea);
    return Promise.reject(err);
  }
};

export const SUMS_PROBLEMS = {
  TWO_SUM: {
    title: "Two Sum",
    platform: "LeetCode",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    notes: {
      desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      intuition: "Instead of quadratic O(N^2) brute-force checking every pair, use a Hash Map. For each element `x`, calculate its complement `target - x`. If the complement exists in the map, we found our pair in O(1) average lookup time!",
      complexity: "Time: O(N) Single Pass | Space: O(N) Hash Map"
    },
    code: {
      JS: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      Python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      "C++": `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
      Java: `import java.util.*;

public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] { seen.get(complement), i };
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}`,
      C: `// Two Sum in C using hash table`
    },
    generator: (nums = [2, 7, 11, 15], target = 9) => {
      const steps = [];
      const map = {};
      steps.push({ line: 1, msg: `Start Two Sum search for target ${target}. Initialize empty Hash Map.`, variables: { nums, target, map: "{}" } });
      for (let i = 0; i < nums.length; i++) {
        const val = nums[i];
        const comp = target - val;
        steps.push({ line: 2, msg: `Index ${i}: val = ${val}. Calculate complement: ${target} - ${val} = ${comp}.`, variables: { i, val, complement: comp, map: JSON.stringify(map) }, highlightIdx: [i] });
        if (map[comp] !== undefined) {
          steps.push({ line: 3, msg: `Found complement ${comp} in map at index ${map[comp]}! Result: [${map[comp]}, ${i}].`, variables: { result: [map[comp], i] }, highlightIdx: [map[comp], i], matched: true, completed: true });
          return steps;
        }
        map[val] = i;
        steps.push({ line: 4, msg: `Store ${val} -> index ${i} in map.`, variables: { map: JSON.stringify(map) }, highlightIdx: [i] });
      }
      steps.push({ line: 5, msg: "No two sum solution found.", completed: true });
      return steps;
    }
  },
  VALID_PARENTHESES: {
    title: "Valid Parentheses",
    platform: "LeetCode",
    difficulty: "Easy",
    category: "Stack ADT",
    notes: {
      desc: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      intuition: "Use a LIFO Stack. When encountering an opening bracket, push it onto the stack. When encountering a closing bracket, pop from the stack and verify that the popped bracket matches the corresponding opening bracket.",
      complexity: "Time: O(N) | Space: O(N) Stack"
    },
    code: {
      JS: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else {
      if (!stack.length || stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
      Python: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        elif not stack or stack.pop() != mapping[char]:
            return False
    return len(stack) == 0`,
      "C++": `#include <stack>
#include <string>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;
        }
    }
    return st.empty();
}`,
      Java: `import java.util.Stack;

public boolean isValid(String s) {
    Stack<Character> st = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.isEmpty()) return false;
            char top = st.pop();
            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;
        }
    }
    return st.isEmpty();
}`,
      C: `// Valid Parentheses in C`
    },
    generator: (s = "()[]{}") => {
      const steps = [];
      const stack = [];
      steps.push({ line: 1, msg: `Start validation of string "${s}". Initialize empty Stack.`, variables: { s, stack: [] } });
      const map = { ')': '(', '}': '{', ']': '[' };
      for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === '(' || ch === '{' || ch === '[') {
          stack.push(ch);
          steps.push({ line: 2, msg: `Scanned opening bracket '${ch}'. Push to Stack.`, variables: { char: ch, stack: [...stack] }, stack: [...stack] });
        } else {
          const expected = map[ch];
          if (!stack.length || stack[stack.length - 1] !== expected) {
            steps.push({ line: 3, msg: `Mismatch! Found '${ch}' but stack top is not '${expected}'. Return FALSE.`, variables: { char: ch, stack: [...stack] }, matched: false, completed: true });
            return steps;
          }
          const popped = stack.pop();
          steps.push({ line: 4, msg: `Matched '${popped}' with '${ch}'. Pop from stack.`, variables: { char: ch, stack: [...stack] }, stack: [...stack] });
        }
      }
      const valid = stack.length === 0;
      steps.push({ line: 5, msg: valid ? "All brackets properly closed and nested! Return TRUE." : "Unclosed brackets remaining in stack. Return FALSE.", variables: { stack: [...stack] }, matched: valid, completed: true });
      return steps;
    }
  },
  REVERSE_LINKED_LIST: {
    title: "Reverse Linked List",
    platform: "LeetCode",
    difficulty: "Easy",
    category: "Linked Lists",
    notes: {
      desc: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
      intuition: "Maintain 3 pointers: `prev` (null), `curr` (head), and `next` (curr.next). In each step, save `next = curr.next`, point `curr.next = prev`, shift `prev = curr`, and shift `curr = next`.",
      complexity: "Time: O(N) | Space: O(1) In-Place"
    },
    code: {
      JS: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
      Python: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      "C++": `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      Java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      C: `// Reverse Linked List in C`
    },
    generator: (nodes = [10, 20, 30, 40]) => {
      const steps = [];
      let prev = null;
      let curr = 0;
      steps.push({ line: 1, msg: "Initialize 3 pointers: prev = NULL, curr = Head (10).", variables: { nodes, prev: "NULL", curr: nodes[0] } });
      for (let i = 0; i < nodes.length; i++) {
        steps.push({ line: 2, msg: `Step ${i + 1}: Reverse pointer: Node(${nodes[i]}).next points to ${prev === null ? 'NULL' : nodes[prev]}.`, variables: { prev: prev === null ? 'NULL' : nodes[prev], curr: nodes[i] }, highlightIdx: [i] });
        prev = i;
      }
      steps.push({ line: 3, msg: `Reversal complete! New Head is Node(${nodes[nodes.length - 1]}).`, variables: { newHead: nodes[nodes.length - 1] }, completed: true });
      return steps;
    }
  },
  BEST_TIME_STOCK: {
    title: "Best Time to Buy and Sell Stock",
    platform: "LeetCode",
    difficulty: "Easy",
    category: "Greedy / One Pass",
    notes: {
      desc: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy and a different day in the future to sell.",
      intuition: "Track the minimum price seen so far (`minPrice`). For each day's price, calculate potential profit `price - minPrice`. Update `maxProfit` if current profit is higher.",
      complexity: "Time: O(N) Single Pass | Space: O(1)"
    },
    code: {
      JS: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (let p of prices) {
    if (p < minPrice) minPrice = p;
    else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
  }
  return maxProfit;
}`,
      Python: `def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_profit:
            max_profit = p - min_price
    return max_profit`,
      "C++": `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, maxProfit = 0;
    for (int p : prices) {
        if (p < minPrice) minPrice = p;
        else maxProfit = max(maxProfit, p - minPrice);
    }
    return maxProfit;
}`,
      Java: `public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE, maxProfit = 0;
    for (int p : prices) {
        if (p < minPrice) minPrice = p;
        else maxProfit = Math.max(maxProfit, p - minPrice);
    }
    return maxProfit;
}`,
      C: `// Stock Buy & Sell in C`
    },
    generator: (prices = [7, 1, 5, 3, 6, 4]) => {
      const steps = [];
      let minPrice = prices[0];
      let maxProfit = 0;
      steps.push({ line: 1, msg: `Initialize minPrice = ${minPrice}, maxProfit = 0.`, variables: { prices, minPrice, maxProfit, i: 0 } });
      for (let i = 1; i < prices.length; i++) {
        const p = prices[i];
        if (p < minPrice) {
          minPrice = p;
          steps.push({ line: 2, msg: `Day ${i}: Price dropped to ${p}. Update minPrice to ${minPrice}.`, variables: { i, price: p, minPrice, maxProfit }, highlightIdx: [i] });
        } else {
          const profit = p - minPrice;
          if (profit > maxProfit) {
            maxProfit = profit;
            steps.push({ line: 3, msg: `Day ${i}: Sell at ${p} (Bought at ${minPrice}). New MAX profit = ${maxProfit}!`, variables: { i, price: p, minPrice, maxProfit }, highlightIdx: [i], updated: true });
          } else {
            steps.push({ line: 4, msg: `Day ${i}: Price ${p} gives profit ${profit} (<= maxProfit ${maxProfit}).`, variables: { i, price: p, minPrice, maxProfit }, highlightIdx: [i] });
          }
        }
      }
      steps.push({ line: 5, msg: `Scan complete! Maximum possible profit: ${maxProfit}`, variables: { maxProfit }, completed: true });
      return steps;
    }
  },
  MAX_SUBARRAY_KADANE: {
    title: "Maximum Subarray (Kadane's Algorithm)",
    platform: "LeetCode",
    difficulty: "Medium",
    category: "Dynamic Programming",
    notes: {
      desc: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      intuition: "Kadane's algorithm: at each index `i`, we decide whether to add `nums[i]` to current sum, or restart the subarray at `nums[i]`: `currSum = max(nums[i], currSum + nums[i])`.",
      complexity: "Time: O(N) Single Pass | Space: O(1)"
    },
    code: {
      JS: `function maxSubArray(nums) {
  let currSum = nums[0], maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currSum = Math.max(nums[i], currSum + nums[i]);
    maxSum = Math.max(maxSum, currSum);
  }
  return maxSum;
}`,
      Python: `def max_sub_array(nums):
    curr_sum = max_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum`,
      "C++": `int maxSubArray(vector<int>& nums) {
    int currSum = nums[0], maxSum = nums[0];
    for (size_t i = 1; i < nums.size(); ++i) {
        currSum = max(nums[i], currSum + nums[i]);
        maxSum = max(maxSum, currSum);
    }
    return maxSum;
}`,
      Java: `public int maxSubArray(int[] nums) {
    int currSum = nums[0], maxSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currSum = Math.max(nums[i], currSum + nums[i]);
        maxSum = Math.max(maxSum, currSum);
    }
    return maxSum;
}`,
      C: `// Kadane's Algorithm in C`
    },
    generator: (nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) => {
      const steps = [];
      let currSum = nums[0], maxSum = nums[0];
      steps.push({ line: 1, msg: `Initialize Kadane: currSum = ${currSum}, maxSum = ${maxSum}.`, variables: { nums, currSum, maxSum, i: 0 } });
      for (let i = 1; i < nums.length; i++) {
        const val = nums[i];
        currSum = Math.max(val, currSum + val);
        maxSum = Math.max(maxSum, currSum);
        steps.push({ line: 2, msg: `Index ${i} (${val}): currSum = max(${val}, prev + ${val}) = ${currSum} | maxSum = ${maxSum}`, variables: { i, val, currSum, maxSum }, highlightIdx: [i] });
      }
      steps.push({ line: 3, msg: `Kadane scan complete! Maximum Subarray Sum: ${maxSum}`, variables: { maxSum }, completed: true });
      return steps;
    }
  },
  CONTAINER_WATER: {
    title: "Container With Most Water",
    platform: "LeetCode",
    difficulty: "Medium",
    category: "Two Pointers",
    notes: {
      desc: "Given `n` non-negative integers `height` where each represents a point at coordinate `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
      intuition: "Start two pointers at both ends (`left = 0`, `right = n - 1`). Area is `(right - left) * min(h[left], h[right])`. Move the pointer pointing to the shorter line inward to search for potentially taller walls.",
      complexity: "Time: O(N) | Space: O(1)"
    },
    code: {
      JS: `function maxArea(height) {
  let left = 0, right = height.length - 1, maxWater = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, h * (right - left));
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,
      Python: `def max_area(height):
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        h = min(height[left], height[right])
        max_water = max(max_water, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
      "C++": `int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1, maxWater = 0;
    while (left < right) {
        int h = min(height[left], height[right]);
        maxWater = max(maxWater, h * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`,
      Java: `public int maxArea(int[] height) {
    int left = 0, right = height.length - 1, maxWater = 0;
    while (left < right) {
        int h = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, h * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}`,
      C: `// Container With Most Water in C`
    },
    generator: (height = [1, 8, 6, 2, 5, 4, 8, 3, 7]) => {
      const steps = [];
      let left = 0, right = height.length - 1, maxWater = 0;
      steps.push({ line: 1, msg: `Initialize two pointers: left = 0 (h: ${height[left]}), right = ${right} (h: ${height[right]}).`, variables: { left, right, maxWater } });
      while (left < right) {
        const h = Math.min(height[left], height[right]);
        const width = right - left;
        const area = h * width;
        maxWater = Math.max(maxWater, area);
        steps.push({ line: 2, msg: `Width = ${width}, Min Height = ${h} -> Water Area = ${area}. Max = ${maxWater}`, variables: { left, right, area, maxWater }, highlightIdx: [left, right] });
        if (height[left] < height[right]) left++;
        else right--;
      }
      steps.push({ line: 3, msg: `Completed Two-Pointer scan! Max water capacity = ${maxWater}`, variables: { maxWater }, completed: true });
      return steps;
    }
  },
  SMALL_FACTORIALS_CODECHEF: {
    title: "Small Factorials (FCTRL2)",
    platform: "CodeChef",
    difficulty: "Easy",
    category: "Big Integer Arrays",
    notes: {
      desc: "Given an integer N <= 100, calculate N! (N factorial). Since 100! has 158 digits, it exceeds 64-bit integer limits.",
      intuition: "Store the big number digits in an integer array `res[]`. Multiply the array by each integer `x = 2...N` using grade-school elementary multiplication with carry propagation.",
      complexity: "Time: O(N * digits) | Space: O(digits)"
    },
    code: {
      JS: `function factorialBig(n) {
  let res = [1];
  for (let x = 2; x <= n; x++) {
    let carry = 0;
    for (let i = 0; i < res.length; i++) {
      let prod = res[i] * x + carry;
      res[i] = prod % 10;
      carry = Math.floor(prod / 10);
    }
    while (carry) {
      res.push(carry % 10);
      carry = Math.floor(carry / 10);
    }
  }
  return res.reverse().join('');
}
console.log(factorialBig(25));`,
      Python: `def factorial_big(n):
    res = [1]
    for x in range(2, n + 1):
        carry = 0
        for i in range(len(res)):
            prod = res[i] * x + carry
            res[i] = prod % 10
            carry = prod // 10
        while carry:
            res.append(carry % 10)
            carry //= 10
    return "".join(map(str, reversed(res)))
print(factorial_big(25))`,
      "C++": `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void factorialBig(int n) {
    vector<int> res = {1};
    for (int x = 2; x <= n; ++x) {
        int carry = 0;
        for (size_t i = 0; i < res.size(); ++i) {
            int prod = res[i] * x + carry;
            res[i] = prod % 10;
            carry = prod / 10;
        }
        while (carry) {
            res.push_back(carry % 10);
            carry /= 10;
        }
    }
    for (int i = res.size() - 1; i >= 0; --i) cout << res[i];
    cout << endl;
}

int main() {
    factorialBig(25);
    return 0;
}`,
      Java: `import java.util.*;

public class Main {
    public static void factorialBig(int n) {
        List<Integer> res = new ArrayList<>();
        res.add(1);
        for (int x = 2; x <= n; x++) {
            int carry = 0;
            for (int i = 0; i < res.size(); i++) {
                int prod = res.get(i) * x + carry;
                res.set(i, prod % 10);
                carry = prod / 10;
            }
            while (carry > 0) {
                res.add(carry % 10);
                carry /= 10;
            }
        }
        for (int i = res.size() - 1; i >= 0; i--) System.out.print(res.get(i));
        System.out.println();
    }
}`,
      C: `// Big Integer Factorial in C`
    },
    generator: (n = 6) => {
      const steps = [];
      let res = [1];
      steps.push({ line: 1, msg: `Initialize big integer array with [1] for ${n}!.`, variables: { n, digits: [...res] } });
      for (let x = 2; x <= n; x++) {
        let carry = 0;
        for (let i = 0; i < res.length; i++) {
          let prod = res[i] * x + carry;
          res[i] = prod % 10;
          carry = Math.floor(prod / 10);
        }
        while (carry) {
          res.push(carry % 10);
          carry = Math.floor(carry / 10);
        }
        const str = [...res].reverse().join('');
        steps.push({ line: 2, msg: `Multiply array by ${x}: Result so far = ${str}`, variables: { multiplier: x, result: str, digits: [...res] } });
      }
      steps.push({ line: 3, msg: `Calculation finished! ${n}! = ${[...res].reverse().join('')}`, completed: true });
      return steps;
    }
  },
  LAPINDROMES_CODECHEF: {
    title: "Lapindromes (LAPIN)",
    platform: "CodeChef",
    difficulty: "Easy",
    category: "Frequency Hashing",
    notes: {
      desc: "A string is a Lapindrome if the frequencies of each character in the first half of the string equal the frequencies in the second half (ignoring the middle char if length is odd).",
      intuition: "Split the string into left half and right half. Count character frequencies in both halves using two 26-element integer frequency arrays. If both arrays match identically, it is a Lapindrome!",
      complexity: "Time: O(N) | Space: O(1) (26 characters)"
    },
    code: {
      JS: `function isLapindrome(s) {
  let n = s.length, half = Math.floor(n / 2);
  let leftCount = Array(26).fill(0);
  let rightCount = Array(26).fill(0);
  for (let i = 0; i < half; i++) {
    leftCount[s.charCodeAt(i) - 97]++;
    rightCount[s.charCodeAt(n - 1 - i) - 97]++;
  }
  return leftCount.every((c, i) => c === rightCount[i]);
}`,
      Python: `def is_lapindrome(s):
    n = len(s)
    half = n // 2
    left = sorted(s[:half])
    right = sorted(s[n - half:])
    return left == right`,
      "C++": `bool isLapindrome(string s) {
    int n = s.length(), half = n / 2;
    int left[26] = {0}, right[26] = {0};
    for (int i = 0; i < half; ++i) {
        left[s[i] - 'a']++;
        right[s[n - 1 - i] - 'a']++;
    }
    for (int i = 0; i < 26; ++i) if (left[i] != right[i]) return false;
    return true;
}`,
      Java: `public boolean isLapindrome(String s) {
    int n = s.length(), half = n / 2;
    int[] left = new int[26], right = new int[26];
    for (int i = 0; i < half; i++) {
        left[s.charAt(i) - 'a']++;
        right[s.charAt(n - 1 - i) - 'a']++;
    }
    return Arrays.equals(left, right);
}`,
      C: `// Lapindromes in C`
    },
    generator: (s = "rotor") => {
      const steps = [];
      const n = s.length;
      const half = Math.floor(n / 2);
      const leftHalf = s.slice(0, half);
      const rightHalf = s.slice(n - half);
      steps.push({ line: 1, msg: `String "${s}" (Length: ${n}). Left Half: "${leftHalf}", Right Half: "${rightHalf}".`, variables: { s, leftHalf, rightHalf } });
      const leftCount = Array(26).fill(0);
      const rightCount = Array(26).fill(0);
      for (let i = 0; i < half; i++) {
        leftCount[s.charCodeAt(i) - 97]++;
        rightCount[s.charCodeAt(n - 1 - i) - 97]++;
      }
      const match = leftCount.every((c, i) => c === rightCount[i]);
      steps.push({ line: 2, msg: `Compare frequency maps: Left "${leftHalf}" vs Right "${rightHalf}" -> Match = ${match ? 'YES' : 'NO'}.`, variables: { match }, matched: match, completed: true });
      return steps;
    }
  }
};

const DSASumsVisualizer = ({ onBack, onOpenDebugger }) => {
  const [selectedKey, setSelectedKey] = useState('TWO_SUM');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLang, setActiveLang] = useState('C++');
  const [codeViewMode, setCodeViewMode] = useState('full');
  const [codeFontSize, setCodeFontSize] = useState(16);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const playTimerRef = useRef(null);

  const activeProblem = SUMS_PROBLEMS[selectedKey] || SUMS_PROBLEMS['TWO_SUM'];
  const steps = activeProblem.generator ? activeProblem.generator() : [];
  const currentStep = steps[currentStepIdx] || steps[0] || {};
  const rawCode = activeProblem.code[activeLang] || activeProblem.code['C++'] || activeProblem.code['JS'] || '';
  const fullCode = toFullExecutableProgram(rawCode, activeLang, activeProblem.title);
  const activeCodeToDisplay = codeViewMode === 'full' ? fullCode : rawCode;

  // Filtered problems list
  const filteredProblems = Object.entries(SUMS_PROBLEMS).filter(([k, prob]) => {
    const matchesPlatform = (platformFilter === 'ALL' || prob.platform === platformFilter);
    const matchesDiff = (difficultyFilter === 'ALL' || prob.difficulty === difficultyFilter);
    const matchesSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prob.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesDiff && matchesSearch;
  });

  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedKey]);

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    } else {
      clearInterval(playTimerRef.current);
    }
    return () => clearInterval(playTimerRef.current);
  }, [isPlaying, speed, steps.length]);

  const handleCopy = () => {
    copyToClipboard(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary, #0f172a)' }}>
      {/* HEADER */}
      <header className="header-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn btn-clear" onClick={onBack}>🏠 Home</button>
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800 }}>🏆 DSA Practice Sums Arena</h1>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Curated LeetCode & CodeChef Problems with Live Stepper & Sandbox Runner</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn btn-insert"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none' }}
            onClick={() => setIsRunnerOpen(true)}
            title="Execute this problem in cloud sandbox"
          >
            ▶ Run in Sandbox
          </button>
          {onOpenDebugger && isLineDebuggerSupported(activeLang) && (
            <button 
              className="btn btn-clear"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #38bdf8', color: '#38bdf8' }}
              onClick={() => onOpenDebugger(rawCode, activeLang)}
              title="Step through variables and memory stack"
            >
              🐞 Line Debugger
            </button>
          )}
        </div>
      </header>

      {/* MAIN DUAL-PANE VIEW */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR: PROBLEM LIST */}
        <div style={{ width: '330px', borderRight: '1px solid var(--glass-border)', background: 'rgba(15,23,42,0.6)', display: 'flex', flexDirection: 'column' }}>
          {/* SEARCH & FILTERS */}
          <div style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input 
              type="text"
              className="styled-input"
              placeholder="🔍 Search problems..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', fontSize: '0.85rem', padding: '6px 12px' }}
            />
            
            {/* PLATFORM CHIPS */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {['ALL', 'LeetCode', 'CodeChef'].map(p => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    fontSize: '0.72rem',
                    borderRadius: '6px',
                    border: platformFilter === p ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                    background: platformFilter === p ? 'rgba(59,130,246,0.2)' : 'transparent',
                    color: platformFilter === p ? '#60a5fa' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: platformFilter === p ? 700 : 400
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* PROBLEM LIST */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {filteredProblems.map(([k, prob]) => {
              const isSelected = (selectedKey === k);
              const diffColor = prob.difficulty === 'Easy' ? '#10b981' : prob.difficulty === 'Medium' ? '#f59e0b' : '#ef4444';
              const platformColor = prob.platform === 'LeetCode' ? '#fb923c' : '#a855f7';

              return (
                <div
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(59,130,246,0.18)' : 'transparent',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#60a5fa' : 'var(--text-primary)' }}>
                      {prob.title}
                    </span>
                    <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: `${diffColor}22`, color: diffColor, fontWeight: 700 }}>
                      {prob.difficulty}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    <span>🏷️ {prob.category}</span>
                    <span style={{ color: platformColor, fontWeight: 600 }}>{prob.platform}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* HEADER ROW */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', background: activeProblem.platform === 'LeetCode' ? 'rgba(251,146,60,0.15)' : 'rgba(168,85,247,0.15)', color: activeProblem.platform === 'LeetCode' ? '#fb923c' : '#c084fc', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  {activeProblem.platform}
                </span>
                <span style={{ fontSize: '0.75rem', background: activeProblem.difficulty === 'Easy' ? 'rgba(16,185,129,0.15)' : activeProblem.difficulty === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: activeProblem.difficulty === 'Easy' ? '#34d399' : activeProblem.difficulty === 'Medium' ? '#fbbf24' : '#f87171', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  {activeProblem.difficulty}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {activeProblem.category}
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>{activeProblem.title}</h2>
            </div>
          </div>

          {/* PROBLEM INTUITION & COMPLEXITY */}
          <div style={{ background: 'var(--glass-bg)', padding: '1rem 1.2rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
              <strong>Description:</strong> {activeProblem.notes.desc}
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.88rem', lineHeight: '1.6', color: '#60a5fa' }}>
              💡 <strong>Intuition:</strong> {activeProblem.notes.intuition}
            </p>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
              📊 {activeProblem.notes.complexity}
            </span>
          </div>

          {/* INTERACTIVE STEP SIMULATOR */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                🎬 Step Execution Simulation (Step {currentStepIdx + 1} of {steps.length})
              </span>

              {/* CONTROLS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  className="btn btn-clear"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentStepIdx === 0}
                >
                  ⏮ Prev
                </button>
                <button 
                  className="btn btn-insert"
                  style={{ padding: '4px 14px', fontSize: '0.8rem' }}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button 
                  className="btn btn-clear"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
                  disabled={currentStepIdx >= steps.length - 1}
                >
                  Next ⏭
                </button>
                <button 
                  className="btn btn-clear"
                  style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                  onClick={() => setCurrentStepIdx(0)}
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* LIVE STEP MESSAGE */}
            <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.12)', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '12px', fontSize: '0.9rem', color: '#fff' }}>
              {currentStep.msg || "Initializing problem simulation..."}
            </div>

            {/* VARIABLES TABLE */}
            {currentStep.variables && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                {Object.entries(currentStep.variables).map(([k, v]) => (
                  <span key={k} style={{ fontSize: '0.78rem', fontFamily: 'monospace', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-primary)' }}>
                    <strong style={{ color: '#60a5fa' }}>{k}:</strong> {Array.isArray(v) ? JSON.stringify(v) : String(v)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* MULTI-LANGUAGE CODE VIEWER */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>💻 Solution Code:</span>
                {['C++', 'Java', 'Python', 'JS', 'C'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    style={{
                      padding: '3px 10px',
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                      border: activeLang === lang ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                      background: activeLang === lang ? 'var(--accent-primary)' : 'transparent',
                      color: activeLang === lang ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: activeLang === lang ? 700 : 400
                    }}
                  >
                    {lang === 'JS' ? 'JavaScript' : lang}
                  </button>
                ))}

                {/* Full Program vs Snippet Toggle */}
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '2px', border: '1px solid var(--glass-border)', marginLeft: '6px' }}>
                  <button 
                    onClick={() => setCodeViewMode('full')}
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.74rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: codeViewMode === 'full' ? 'var(--accent-primary)' : 'transparent',
                      color: codeViewMode === 'full' ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: codeViewMode === 'full' ? 700 : 500
                    }}
                    title="Display full complete runnable program with imports and main()"
                  >
                    📑 Complete Code
                  </button>
                  <button 
                    onClick={() => setCodeViewMode('snippet')}
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.74rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: codeViewMode === 'snippet' ? 'var(--accent-primary)' : 'transparent',
                      color: codeViewMode === 'snippet' ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: codeViewMode === 'snippet' ? 700 : 500
                    }}
                    title="Display function snippet only"
                  >
                    ⚡ Snippet
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                  <button onClick={() => setCodeFontSize(prev => Math.max(12, prev - 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '2px 7px', cursor: 'pointer' }} title="Decrease font size">A−</button>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', minWidth: '32px', textAlign: 'center', fontWeight: 600 }}>{codeFontSize}px</span>
                  <button onClick={() => setCodeFontSize(prev => Math.min(36, prev + 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '2px 7px', cursor: 'pointer' }} title="Increase font size">A+</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-clear"
                  style={{ padding: '3px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={handleCopy}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
                <button
                  className="btn btn-insert"
                  style={{ padding: '3px 12px', fontSize: '0.75rem' }}
                  onClick={() => setIsRunnerOpen(true)}
                >
                  ▶ Run in Sandbox
                </button>
              </div>
            </div>

            <pre style={{
              margin: 0,
              padding: '16px 20px',
              background: 'var(--bg-primary, rgba(0,0,0,0.3))',
              color: '#f8fafc',
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontSize: `${codeFontSize}px`,
              lineHeight: '1.75',
              fontWeight: 500,
              overflowX: 'auto'
            }}>
              {toAllman(activeCodeToDisplay).split('\n').map((line, idx) => (
                <div key={idx} style={{ padding: '1px 0', whiteSpace: 'pre', color: '#f8fafc' }}>
                  {line || ' '}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>

      {/* CODE RUNNER MODAL */}
      <CodeRunnerModal
        isOpen={isRunnerOpen}
        onClose={() => setIsRunnerOpen(false)}
        code={activeCodeToDisplay}
        language={activeLang}
      />
    </div>
  );
};

export default DSASumsVisualizer;
