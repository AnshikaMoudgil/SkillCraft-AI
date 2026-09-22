from typing import Dict, Any, List

class CodingProblemsDB:
    def __init__(self):
        self.problems: Dict[str, Dict[str, Any]] = {
            "Two Sum": {
                "problem_id": "two-sum",
                "title": "Two Sum",
                "slug": "two-sum",
                "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
                "difficulty": "Easy",
                "category": "Array",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}",
                    "C++": "#include <vector>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Your code here\n        return {};\n    }\n};",
                    "Python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Your code here\n        return []",
                    "JavaScript": "function twoSum(nums, target) {\n    // Your code here\n    return [];\n}"
                },
                "visible_test_cases": [
                    { "id": 1, "input": "4\n2 7 11 15\n9", "expected": "0 1" },
                    { "id": 2, "input": "3\n3 2 4\n6", "expected": "1 2" },
                    { "id": 3, "input": "2\n3 3\n6", "expected": "0 1" }
                ],
                "hidden_test_cases": [
                    { "id": 4, "input": "5\n-1 -2 -3 -4 -5\n-8", "expected": "2 4" },
                    { "id": 5, "input": "4\n0 4 3 0\n0", "expected": "0 3" }
                ],
                "hints": [
                    "Think about how you can remember numbers you have already visited instead of using nested loops.",
                    "A Hash Table allows O(1) average time lookups for the complement (target - num).",
                    "Store each number as the key and its index as the value while iterating."
                ],
                "constraints": [
                    "2 <= nums.length <= 10^4",
                    "-10^9 <= nums[i] <= 10^9",
                    "-10^9 <= target <= 10^9",
                    "Only one valid answer exists."
                ]
            },
            "Valid Parentheses": {
                "problem_id": "valid-parentheses",
                "title": "Valid Parentheses",
                "slug": "valid-parentheses",
                "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.",
                "difficulty": "Easy",
                "category": "Stack",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return true;\n    }\n}",
                    "C++": "#include <string>\n\nclass Solution {\npublic:\n    bool isValid(std::string s) {\n        // Your code here\n        return true;\n    }\n};",
                    "Python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Your code here\n        return True",
                    "JavaScript": "function isValid(s) {\n    // Your code here\n    return true;\n}"
                },
                "visible_test_cases": [
                    { "id": 1, "input": "()", "expected": "true" },
                    { "id": 2, "input": "()[]{}", "expected": "true" },
                    { "id": 3, "input": "(]", "expected": "false" }
                ],
                "hidden_test_cases": [
                    { "id": 4, "input": "([)]", "expected": "false" },
                    { "id": 5, "input": "{[]}", "expected": "true" }
                ],
                "hints": [
                    "A Stack is the natural data structure for matching nested opening and closing delimiters.",
                    "Whenever you encounter an opening bracket, push its expected closer onto the stack.",
                    "If you encounter a closing bracket, verify it matches the top of the stack."
                ],
                "constraints": [
                    "1 <= s.length <= 10^4",
                    "s consists of parentheses only '()[]{}'."
                ]
            },
            "Maximum Subarray": {
                "problem_id": "maximum-subarray",
                "title": "Maximum Subarray",
                "slug": "maximum-subarray",
                "description": "Given an integer array `nums`, find the contiguous subarray with the largest sum and return its sum.\n\nA subarray is a contiguous part of the array.",
                "difficulty": "Medium",
                "category": "Array",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}",
                    "C++": "#include <vector>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int maxSubArray(std::vector<int>& nums) {\n        // Your code here\n        return 0;\n    }\n};",
                    "Python": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Your code here\n        return 0",
                    "JavaScript": "function maxSubArray(nums) {\n    // Your code here\n    return 0;\n}"
                },
                "visible_test_cases": [
                    {"id": 1, "input": "9\n-2 1 -3 4 -1 2 1 -5 4", "expected": "6"},
                    {"id": 2, "input": "5\n1 2 3 4 5", "expected": "15"},
                    {"id": 3, "input": "5\n-1 -2 -3 -4 -5", "expected": "-1"}
                ],
                "hidden_test_cases": [
                    {"id": 4, "input": "1\n5", "expected": "5"},
                    {"id": 5, "input": "5\n-2 1 -3 4 -1", "expected": "4"}
                ],
                "hints": [
                    "Try keeping track of the best sum ending at the current position.",
                    "Kadane's Algorithm solves this problem in O(n) time.",
                    "At every element, decide whether to start a new subarray or extend the current one."
                ],
                "constraints": [
                    "1 <= nums.length <= 10^5",
                    "-10^4 <= nums[i] <= 10^4"
                ]
            },
            "Longest Substring Without Repeating Characters": {
                "problem_id": "longest-substring-without-repeating-characters",
                "title": "Longest Substring Without Repeating Characters",
                "slug": "longest-substring-without-repeating-characters",
                "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
                "difficulty": "Medium",
                "category": "Sliding Window",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n}",
                    "C++": "#include <string>\n#include <unordered_set>\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(std::string s) {\n        // Your code here\n        return 0;\n    }\n};",
                    "Python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Your code here\n        return 0",
                    "JavaScript": "function lengthOfLongestSubstring(s) {\n    // Your code here\n    return 0;\n}"
                },
                "visible_test_cases": [
                    {"id": 1, "input": "abcabcbb", "expected": "3"},
                    {"id": 2, "input": "bbbbb", "expected": "1"},
                    {"id": 3, "input": "pwwkew", "expected": "3"}
                ],
                "hidden_test_cases": [
                    {"id": 4, "input": "", "expected": "0"},
                    {"id": 5, "input": "abcdef", "expected": "6"}
                ],
                "hints": [
                    "Use two pointers to maintain a window.",
                    "Keep track of characters currently inside the window.",
                    "When a duplicate appears, move the left pointer until the window becomes valid again."
                ],
                "constraints": [
                    "0 <= s.length <= 5 * 10^4",
                    "s consists of English letters, digits, symbols and spaces."
                ]
            },
            "Binary Search": {
                "problem_id": "binary-search",
                "title": "Binary Search",
                "slug": "binary-search",
                "description": "Given a sorted array of integers `nums` and an integer `target`, return the index of `target` if it exists in the array. Otherwise, return -1.",
                "difficulty": "Easy",
                "category": "Binary Search",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}",
                    "C++": "#include <vector>\n\nclass Solution {\npublic:\n    int search(std::vector<int>& nums, int target) {\n        // Your code here\n        return -1;\n    }\n};",
                    "Python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Your code here\n        return -1",
                    "JavaScript": "function search(nums, target) {\n    // Your code here\n    return -1;\n}"
                },
                "visible_test_cases": [
                    {"id": 1, "input": "6\n-1 0 3 5 9 12\n9", "expected": "4"},
                    {"id": 2, "input": "6\n-1 0 3 5 9 12\n2", "expected": "-1"},
                    {"id": 3, "input": "1\n5\n5", "expected": "0"}
                ],
                "hidden_test_cases": [
                    {"id": 4, "input": "5\n1 2 3 4 5\n1", "expected": "0"},
                    {"id": 5, "input": "5\n1 2 3 4 5\n5", "expected": "4"}
                ],
                "hints": [
                    "The array is already sorted.",
                    "Use left, right and mid pointers.",
                    "If nums[mid] is smaller than target, search the right half; otherwise search the left half."
                ],
                "constraints": [
                    "1 <= nums.length <= 10^4",
                    "-10^4 <= nums[i], target <= 10^4",
                    "All values in nums are unique.",
                    "nums is sorted in ascending order."
                ]
            },
            "Search in Rotated Sorted Array": {
                "problem_id": "search-in-rotated-sorted-array",
                "title": "Search in Rotated Sorted Array",
                "slug": "search-in-rotated-sorted-array",
                "description": "Given a rotated sorted array of distinct integers `nums` and an integer `target`, return the index of `target` if it exists. Otherwise, return -1.\n\nThe array was originally sorted in ascending order and then rotated at an unknown pivot.",
                "difficulty": "Medium",
                "category": "Binary Search",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}",
                    "C++": "#include <vector>\n\nclass Solution {\npublic:\n    int search(std::vector<int>& nums, int target) {\n        // Your code here\n        return -1;\n    }\n};",
                    "Python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Your code here\n        return -1",
                    "JavaScript": "function search(nums, target) {\n    // Your code here\n    return -1;\n}"
                },
                "visible_test_cases": [
                    {"id": 1, "input": "7\n4 5 6 7 0 1 2\n0", "expected": "4"},
                    {"id": 2, "input": "7\n4 5 6 7 0 1 2\n3", "expected": "-1"},
                    {"id": 3, "input": "1\n1\n0", "expected": "-1"}
                ],
                "hidden_test_cases": [
                    {"id": 4, "input": "5\n5 1 2 3 4\n1", "expected": "1"},
                    {"id": 5, "input": "6\n6 7 8 1 2 3\n8", "expected": "2"}
                ],
                "hints": [
                    "At least one half of the array is always sorted.",
                    "Check whether the left half or right half is sorted.",
                    "Use binary search while deciding which sorted half can contain the target."
                ],
                "constraints": [
                    "1 <= nums.length <= 5000",
                    "-10^4 <= nums[i], target <= 10^4",
                    "All values in nums are distinct."
                ]
            },
            "Reverse Linked List": {
                "problem_id": "reverse-linked-list",
                "title": "Reverse Linked List",
                "slug": "reverse-linked-list",
                "description": "Given the head of a singly linked list, reverse the list and return the reversed linked list.",
                "difficulty": "Easy",
                "category": "Linked List",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n        return null;\n    }\n}",
                    "C++": "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Your code here\n        return nullptr;\n    }\n};",
                    "Python": "class Solution:\n    def reverseList(self, head):\n        # Your code here\n        return None",
                    "JavaScript": "function reverseList(head) {\n    // Your code here\n    return null;\n}"
                },
                "visible_test_cases": [
                    {"id": 1, "input": "5\n1 2 3 4 5", "expected": "5 4 3 2 1"},
                    {"id": 2, "input": "2\n1 2", "expected": "2 1"},
                    {"id": 3, "input": "1\n1", "expected": "1"}
                ],
                "hidden_test_cases": [
                    {"id": 4, "input": "0", "expected": ""},
                    {"id": 5, "input": "4\n10 20 30 40", "expected": "40 30 20 10"}
                ],
                "hints": [
                    "Use three pointers: previous, current and next.",
                    "Save current.next before changing the pointer.",
                    "Move previous and current forward after reversing the link."
                ],
                "constraints": [
                    "0 <= number of nodes <= 5000",
                    "-5000 <= Node.val <= 5000"
                ]
            },
            "Number of Islands": {
                "problem_id": "number-of-islands",
                "title": "Number of Islands",
                "slug": "number-of-islands",
                "description": "Given an m x n 2D grid containing '1' for land and '0' for water, return the number of islands in the grid.\n\nAn island is formed by connecting adjacent land cells horizontally or vertically.",
                "difficulty": "Medium",
                "category": "Graph / DFS / BFS",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public int numIslands(char[][] grid) {\n        // Your code here\n        return 0;\n    }\n}",
                    "C++": "#include <vector>\n#include <string>\n\nclass Solution {\npublic:\n    int numIslands(std::vector<std::vector<char>>& grid) {\n        // Your code here\n        return 0;\n    }\n};",
                    "Python": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        # Your code here\n        return 0",
                    "JavaScript": "function numIslands(grid) {\n    // Your code here\n    return 0;\n}"
                },
                "visible_test_cases": [
                    {
                        "id": 1,
                        "input": "4 5\n11110\n11010\n11000\n00000",
                        "expected": "1"
                    },
                    {
                        "id": 2,
                        "input": "4 5\n11000\n11000\n00100\n00011",
                        "expected": "3"
                    },
                    {
                        "id": 3,
                        "input": "1 1\n1",
                        "expected": "1"
                    }
                ],
                "hidden_test_cases": [
                    {
                        "id": 4,
                        "input": "2 2\n00\n00",
                        "expected": "0"
                    },
                    {
                        "id": 5,
                        "input": "3 3\n111\n010\n111",
                        "expected": "1"
                    }
                ],
                "hints": [
                    "Every unvisited land cell represents a possible new island.",
                    "Use DFS or BFS to visit all connected land cells.",
                    "Mark visited cells as water so they are not counted again."
                ],
                "constraints": [
                    "1 <= m, n <= 300",
                    "grid[i][j] is either '0' or '1'."
                ]
            },
            "Binary Tree Level Order Traversal": {
                "problem_id": "binary-tree-level-order-traversal",
                "title": "Binary Tree Level Order Traversal",
                "slug": "binary-tree-level-order-traversal",
                "description": "Given the root of a binary tree, return the level-order traversal of its nodes' values from left to right, level by level.\n\nThe tree is represented using level-order input where `null` represents a missing node.",
                "difficulty": "Medium",
                "category": "Binary Tree / BFS",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}",
                    "C++": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Your code here\n        return {};\n    }\n};",
                    "Python": "class Solution:\n    def levelOrder(self, root):\n        # Your code here\n        return []",
                    "JavaScript": "function levelOrder(root) {\n    // Your code here\n    return [];\n}"
                },
                "visible_test_cases": [
                    {
                        "id": 1,
                        "input": "7\n3 9 20 null null 15 7",
                        "expected": "[[3],[9,20],[15,7]]"
                    },
                    {
                        "id": 2,
                        "input": "1\n1",
                        "expected": "[[1]]"
                    },
                    {
                        "id": 3,
                        "input": "0",
                        "expected": "[]"
                    }
                ],
                "hidden_test_cases": [
                    {
                        "id": 4,
                        "input": "5\n1 2 3 4 5",
                        "expected": "[[1],[2,3],[4,5]]"
                    },
                    {
                        "id": 5,
                        "input": "3\n1 null 2",
                        "expected": "[[1],[2]]"
                    }
                ],
                "hints": [
                    "Level order traversal is naturally solved using BFS.",
                    "Use a Queue to process nodes.",
                    "Process exactly the number of nodes currently in the queue to separate levels."
                ],
                "constraints": [
                    "0 <= number of nodes <= 2000",
                    "-1000 <= Node.val <= 1000"
                ]
            },
            "0/1 Knapsack": {
                "problem_id": "0-1-knapsack",
                "title": "0/1 Knapsack",
                "slug": "0-1-knapsack",
                "description": "Given `n` items, where each item has a weight and a value, and a knapsack with maximum capacity `W`, find the maximum total value that can be obtained by selecting items.\n\nEach item can either be selected once or not selected at all.",
                "difficulty": "Medium",
                "category": "Dynamic Programming",
                "supported_languages": ["Python", "Java", "C++", "JavaScript"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "starter_code": {
                    "Java": "class Solution {\n    public int knapsack(int W, int[] weights, int[] values) {\n        // Your code here\n        return 0;\n    }\n}",
                    "C++": "#include <vector>\n#include <algorithm>\n\nclass Solution {\npublic:\n    int knapsack(int W, std::vector<int>& weights, std::vector<int>& values) {\n        // Your code here\n        return 0;\n    }\n};",
                    "Python": "class Solution:\n    def knapsack(self, W: int, weights: list[int], values: list[int]) -> int:\n        # Your code here\n        return 0",
                    "JavaScript": "function knapsack(W, weights, values) {\n    // Your code here\n    return 0;\n}"
                },
                "visible_test_cases": [
                    {
                        "id": 1,
                        "input": "4\n3\n1 2 3\n6 10 12",
                        "expected": "22"
                    },
                    {
                        "id": 2,
                        "input": "3\n4\n1 2 3 4\n2 4 4 5",
                        "expected": "6"
                    },
                    {
                        "id": 3,
                        "input": "5\n3\n2 3 4\n4 5 7",
                        "expected": "9"
                    }
                ],
                "hidden_test_cases": [
                    {
                        "id": 4,
                        "input": "0\n3\n1 2 3\n10 20 30",
                        "expected": "0"
                    },
                    {
                        "id": 5,
                        "input": "10\n3\n20 30 40\n100 200 300",
                        "expected": "0"
                    }
                ],
                "hints": [
                    "For every item, you have two choices: take it or skip it.",
                    "Define a DP state representing the maximum value for a given capacity.",
                    "If the item fits, compare taking it with skipping it."
                ],
                "constraints": [
                    "1 <= n <= 100",
                    "1 <= W <= 1000",
                    "1 <= weights[i] <= 1000",
                    "1 <= values[i] <= 1000"
                ]
            }
        }

    @property
    def _problems(self) -> Dict[str, Dict[str, Any]]:
        return self.problems

    def get_problem(self, title: str) -> Dict[str, Any]:
        return self.problems.get(title) or next((p for p in self.problems.values() if p.get("slug") == title.lower() or p.get("problem_id") == title.lower()), None)

    def add_problem(self, problem: Dict[str, Any]) -> None:
        title = problem["title"]
        self.problems[title] = problem

coding_problems_db = CodingProblemsDB()
