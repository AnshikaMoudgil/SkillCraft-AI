import { CodingProblem } from '../types';

export const mockCodingProblems: CodingProblem[] = [
  {
    id: 'prob-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Array',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
      'C++': `#include <vector>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        
    }
};`,
      Python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pass`,
      JavaScript: `function twoSum(nums, target) {
    
}`
    },
    testCases: [
      { id: 1, input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: '[0,1]', status: 'passed' },
      { id: 2, input: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: '[1,2]', status: 'passed' },
      { id: 3, input: 'nums = [3,3], target = 6', expected: '[0,1]', actual: '[0,1]', status: 'passed' }
    ],
    hints: [
      'Think about how you can remember numbers you have already visited instead of using nested loops.',
      'A Hash Table allows O(1) average time lookups for the complement (target - num).',
      'Store each number as the key and its index as the value while iterating.'
    ],
    solutionExplanation: 'By maintaining a HashMap of elements to their indices, we can look up whether the target complement exists in O(1) time, reducing the total runtime from O(n^2) to O(n).',
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
      explanation: 'We traverse the list containing n elements only once. Each lookup in the hash table costs only O(1) time on average. Extra space is required for the hash table containing at most n elements.'
    }
  },
  {
    id: 'prob-2',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}".'
    ],
    starterCode: {
      Java: `class Solution {
    public boolean isValid(String s) {
        
    }
}`,
      'C++': `#include <string>

class Solution {
public:
    bool isValid(std::string s) {
        
    }
};`,
      Python: `class Solution:
    def isValid(self, s: str) -> bool:
        pass`,
      JavaScript: `function isValid(s) {
    
}`
    },
    testCases: [
      { id: 1, input: 's = "()"', expected: 'true', actual: 'true', status: 'passed' },
      { id: 2, input: 's = "()[]{}"', expected: 'true', actual: 'true', status: 'passed' },
      { id: 3, input: 's = "(]"', expected: 'false', actual: 'false', status: 'passed' }
    ],
    hints: [
      'A Stack is the natural data structure for matching nested opening and closing delimiters.',
      'Whenever you encounter an opening bracket, push its expected closer onto the stack.',
      'If you encounter a closing bracket, verify it matches the top of the stack.'
    ],
    solutionExplanation: 'Using a LIFO stack allows matching each closing bracket with its most recent corresponding open bracket.',
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
      explanation: 'We traverse the string once (O(n)). In the worst case (e.g. "((((("), we push all brackets onto the stack (O(n) space).'
    }
  }
];
