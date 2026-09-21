from typing import Dict, Any, List

class CodingProblemsDB:
    def __init__(self):
        self.problems = {
            "Two Sum": {
                "problem_id": "two-sum",
                "title": "Two Sum",
                "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "difficulty": "Easy",
                "supported_languages": ["Python 3", "Java", "C++"],
                "time_limit": 2.0,
                "memory_limit": 128000,
                "visible_test_cases": [
                    {
                        "id": 1,
                        "input": "4\n2 7 11 15\n9",
                        "expected": "0 1"
                    },
                    {
                        "id": 2,
                        "input": "3\n3 2 4\n6",
                        "expected": "1 2"
                    },
                    {
                        "id": 3,
                        "input": "2\n3 3\n6",
                        "expected": "0 1"
                    }
                ],
                "hidden_test_cases": [
                    {
                        "id": 4,
                        "input": "5\n-1 -2 -3 -4 -5\n-8",
                        "expected": "2 4"
                    },
                    {
                        "id": 5,
                        "input": "4\n0 4 3 0\n0",
                        "expected": "0 3"
                    }
                ]
            }
        }

    def get_problem(self, title: str) -> Dict[str, Any]:
        return self.problems.get(title)

coding_problems_db = CodingProblemsDB()
