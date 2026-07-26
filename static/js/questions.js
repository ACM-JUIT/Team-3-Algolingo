const QUESTIONS = [
  // ==================== VARIABLES & DATA TYPES ====================
  {
    id: "variables_easy_1",
    topic: "variables",
    difficulty: "easy",
    type: "mcq",
    question: "Which data type stores whole numbers?",
    options: ["float", "int", "str", "bool"],
    answer: "B", // Option B is int
    explanation: "Whole numbers are represented by the int data type in Python."
  },
  {
    id: "variables_easy_2",
    topic: "variables",
    difficulty: "easy",
    type: "fitb",
    question: "`3.14` is a __________. (Enter the data type name)",
    answer: "float",
    explanation: "Numbers with a decimal point belong to the float data type."
  },
  {
    id: "variables_easy_3",
    topic: "variables",
    difficulty: "easy",
    type: "mcq",
    question: "Which is a string?",
    options: ["100", "True", '"Python"', "5.5"],
    answer: "C", // "Python"
    explanation: "Strings are sequences of characters enclosed in quotes."
  },
  {
    id: "variables_easy_4",
    topic: "variables",
    difficulty: "easy",
    type: "fitb",
    question: "Variables are assigned values using the __________ operator.",
    answer: "=",
    explanation: "The single equals sign (=) is the assignment operator in Python."
  },
  {
    id: "variables_easy_5",
    topic: "variables",
    difficulty: "easy",
    type: "mcq",
    question: "Which is a Boolean value?",
    options: ["0", '"True"', "True", "1.0"],
    answer: "C", // True
    explanation: "Booleans can only be True or False (capitalized in Python)."
  },
  {
    id: "variables_easy_6",
    topic: "variables",
    difficulty: "easy",
    type: "fitb",
    question: "The function used to check a variable's data type is __________.",
    answer: "type()",
    explanation: "type(variable) returns the class/type of the variable."
  },
  {
    id: "variables_easy_7",
    topic: "variables",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of `type(25)`?",
    options: ["float", "str", "bool", "int"],
    answer: "D", // int
    explanation: "25 is an integer, so type(25) returns <class 'int'>."
  },
  {
    id: "variables_medium_1",
    topic: "variables",
    difficulty: "medium",
    type: "mcq",
    question: 'What is the data type of `"25"`?',
    options: ["int", "float", "str", "bool"],
    answer: "C", // str
    explanation: "Because 25 is enclosed in quotes, it is treated as a string."
  },
  {
    id: "variables_medium_2",
    topic: "variables",
    difficulty: "medium",
    type: "fitb",
    question: "`10 + 5.0` returns a __________ value. (Enter the data type name)",
    answer: "float",
    explanation: "Adding an integer and a float implicitly converts the result to a float."
  },
  {
    id: "variables_medium_3",
    topic: "variables",
    difficulty: "medium",
    type: "mcq",
    question: 'Which converts `"50"` to an integer?',
    options: ['float("50")', 'str("50")', 'int("50")', 'bool("50")'],
    answer: "C", // int("50")
    explanation: "The int() function casts compatible strings/floats to integers."
  },
  {
    id: "variables_hard_1",
    topic: "variables",
    difficulty: "hard",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `x = "10"\ny = 5\nprint(int(x) + y)`,
    options: ["105", '"105"', "15", "Error"],
    answer: "C", // 15
    explanation: "int('10') converts it to 10. Then 10 + 5 equals 15."
  },
  {
    id: "variables_hard_2",
    topic: "variables",
    difficulty: "hard",
    type: "fitb",
    question: "If `x = True`, then what does `x + 2` equal? (Python treats True as 1 numerically)",
    answer: "3",
    explanation: "In Python, bool is a subclass of int. True equals 1, and False equals 0. So, 1 + 2 = 3."
  },

  // ==================== INPUT & OUTPUT ====================
  {
    id: "io_easy_1",
    topic: "io",
    difficulty: "easy",
    type: "mcq",
    question: "Which function takes user input?",
    options: ["print()", "input()", "type()", "output()"],
    answer: "B",
    explanation: "The input() function reads a line of text input from the console."
  },
  {
    id: "io_easy_2",
    topic: "io",
    difficulty: "easy",
    type: "fitb",
    question: "The __________ function displays output. (Include parentheses)",
    answer: "print()",
    explanation: "print() evaluates expressions and prints them to standard output."
  },
  {
    id: "io_easy_3",
    topic: "io",
    difficulty: "easy",
    type: "mcq",
    question: "`input()` returns data of type:",
    options: ["int", "float", "str", "bool"],
    answer: "C",
    explanation: "No matter what is typed, input() always reads and returns it as a string (str)."
  },
  {
    id: "io_easy_4",
    topic: "io",
    difficulty: "easy",
    type: "fitb",
    question: "Complete the code to get user input: `name = __________` (Include parentheses)",
    answer: "input()",
    explanation: "name = input() stores user input inside the variable 'name'."
  },
  {
    id: "io_easy_5",
    topic: "io",
    difficulty: "easy",
    type: "mcq",
    question: "Which code displays \"Hello World\"?",
    options: ['input("Hello World")', 'print("Hello World")', 'show("Hello World")', 'output("Hello World")'],
    answer: "B",
    explanation: 'print("Hello World") will print the string verbatim.'
  },
  {
    id: "io_easy_6",
    topic: "io",
    difficulty: "easy",
    type: "fitb",
    question: "`print(5 + 3)` displays what value?",
    answer: "8",
    explanation: "Python evaluates the arithmetic expression 5 + 3 to 8, then prints it."
  },
  {
    id: "io_easy_7",
    topic: "io",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `name = "Alice"\nprint(name)`,
    options: ["Alice", "name", '"Alice"', "Error"],
    answer: "A",
    explanation: "It prints the value stored in the variable 'name', which is 'Alice'."
  },
  {
    id: "io_medium_1",
    topic: "io",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this code if the user types anything?",
    code: `x = input()\nprint(type(x))`,
    options: ["int", "float", "str", "Error"],
    answer: "C",
    explanation: "Since input() always returns str, type(x) will always print class 'str'."
  },
  {
    id: "io_medium_2",
    topic: "io",
    difficulty: "medium",
    type: "fitb",
    question: "To convert input to an integer, use the __________ function. (Include parentheses)",
    answer: "int()",
    explanation: "Casting with int(input()) converts the string input to an integer."
  },
  {
    id: "io_medium_3",
    topic: "io",
    difficulty: "medium",
    type: "mcq",
    question: "If user enters `5`, what is the output?",
    code: `num = int(input())\nprint(num * 2)`,
    options: ["52", "10", "25", "Error"],
    answer: "B",
    explanation: "The input '5' is cast to integer 5, and 5 * 2 is 10."
  },
  {
    id: "io_hard_1",
    topic: "io",
    difficulty: "hard",
    type: "mcq",
    question: "If the user enters `10` then `20`, what is the output?",
    code: `a = input()\nb = input()\nprint(a + b)`,
    options: ["30", "1020", "Error", "200"],
    answer: "B",
    explanation: "Since input() returns strings, it performs string concatenation: '10' + '20' = '1020'."
  },
  {
    id: "io_hard_2",
    topic: "io",
    difficulty: "hard",
    type: "fitb",
    question: "Complete the code to print the sum of two inputs as integers: `a = int(input())\\n b = int(input())\\n print(__________)`",
    answer: "a + b",
    explanation: "print(a + b) prints the numeric sum of variables a and b."
  },

  // ==================== OPERATORS ====================
  {
    id: "operators_easy_1",
    topic: "operators",
    difficulty: "easy",
    type: "mcq",
    question: "Which operator is used for addition?",
    options: ["*", "+", "/", "%"],
    answer: "B",
    explanation: "+ is the arithmetic operator for addition."
  },
  {
    id: "operators_easy_2",
    topic: "operators",
    difficulty: "easy",
    type: "fitb",
    question: "The multiplication operator is __________.",
    answer: "*",
    explanation: "An asterisk (*) represents multiplication in programming."
  },
  {
    id: "operators_easy_3",
    topic: "operators",
    difficulty: "easy",
    type: "mcq",
    question: "What is the result of `10 - 4`?",
    options: ["14", "6", "40", "2"],
    answer: "B",
    explanation: "10 minus 4 equals 6."
  },
  {
    id: "operators_easy_4",
    topic: "operators",
    difficulty: "easy",
    type: "fitb",
    question: "The remainder (modulo) operator is __________.",
    answer: "%",
    explanation: "The percentage symbol (%) returns the remainder of a division."
  },
  {
    id: "operators_easy_5",
    topic: "operators",
    difficulty: "easy",
    type: "mcq",
    question: "Which operator is used for standard division?",
    options: ["//", "**", "/", "%"],
    answer: "C",
    explanation: "/ performs float division (e.g. 5 / 2 = 2.5)."
  },
  {
    id: "operators_easy_6",
    topic: "operators",
    difficulty: "easy",
    type: "fitb",
    question: "The basic assignment operator is __________.",
    answer: "=",
    explanation: "= is used to assign values to variables."
  },
  {
    id: "operators_easy_7",
    topic: "operators",
    difficulty: "easy",
    type: "mcq",
    question: "What is `2 ** 3`?",
    options: ["6", "8", "9", "5"],
    answer: "B",
    explanation: "** is the exponentiation operator. 2 raised to power of 3 is 8."
  },
  {
    id: "operators_medium_1",
    topic: "operators",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of `print(15 // 4)`?",
    options: ["3.75", "4", "3", "15"],
    answer: "C",
    explanation: "// is integer division (floor division). 15 divided by 4 is 3.75, which floors to 3."
  },
  {
    id: "operators_medium_2",
    topic: "operators",
    difficulty: "medium",
    type: "fitb",
    question: "The comparison operator for equality is __________.",
    answer: "==",
    explanation: "== is used to compare if two values are equal."
  },
  {
    id: "operators_medium_3",
    topic: "operators",
    difficulty: "medium",
    type: "mcq",
    question: "What is the result of `5 > 3 and 2 < 1`?",
    options: ["True", "False", "1", "Error"],
    answer: "B",
    explanation: "5 > 3 is True, but 2 < 1 is False. True and False evaluates to False."
  },
  {
    id: "operators_hard_1",
    topic: "operators",
    difficulty: "hard",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `x = 10\nx += 5\nprint(x)`,
    options: ["10", "5", "15", "Error"],
    answer: "C",
    explanation: "x += 5 is shorthand for x = x + 5, which updates x to 15."
  },
  {
    id: "operators_hard_2",
    topic: "operators",
    difficulty: "hard",
    type: "fitb",
    question: "What does `not (5 > 2)` evaluate to? (Enter True or False)",
    answer: "False",
    explanation: "5 > 2 is True. The 'not' operator inverts it to False."
  },

  // ==================== CONDITIONAL STATEMENTS ====================
  {
    id: "conditionals_easy_1",
    topic: "conditionals",
    difficulty: "easy",
    type: "mcq",
    question: "Which keyword starts a conditional statement?",
    options: ["for", "while", "if", "def"],
    answer: "C",
    explanation: "The 'if' statement is used to execute code conditionally."
  },
  {
    id: "conditionals_easy_2",
    topic: "conditionals",
    difficulty: "easy",
    type: "fitb",
    question: "The keyword used when an `if` condition is false is __________.",
    answer: "else",
    explanation: "The else block runs when all preceding conditions evaluate to False."
  },
  {
    id: "conditionals_easy_3",
    topic: "conditionals",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of this code?",
    code: `if 5 > 3:\n    print("Yes")`,
    options: ["No", "Yes", "True", "Error"],
    answer: "B",
    explanation: "5 is greater than 3, so the condition is True and 'Yes' is printed."
  },
  {
    id: "conditionals_easy_4",
    topic: "conditionals",
    difficulty: "easy",
    type: "fitb",
    question: "Conditional statements help programs make __________.",
    answer: "decisions",
    explanation: "Conditionals allow branching logic based on boolean evaluations."
  },
  {
    id: "conditionals_easy_5",
    topic: "conditionals",
    difficulty: "easy",
    type: "mcq",
    question: "Which symbol must follow an `if` condition in Python?",
    options: [";", ".", ":", ","],
    answer: "C",
    explanation: "A colon (:) starts an indented block of code in Python."
  },
  {
    id: "conditionals_easy_6",
    topic: "conditionals",
    difficulty: "easy",
    type: "fitb",
    question: "Code inside an `if` block must be __________ (shifted to the right).",
    answer: "indented",
    explanation: "Python uses indentation (whitespaces) to define block scopes."
  },
  {
    id: "conditionals_easy_7",
    topic: "conditionals",
    difficulty: "easy",
    type: "mcq",
    question: "Which keyword checks another condition if the first is False?",
    options: ["otherwise", "elif", "next", "then"],
    answer: "B",
    explanation: "'elif' is short for 'else if' in Python."
  },
  {
    id: "conditionals_medium_1",
    topic: "conditionals",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `x = 10\nif x > 15:\n    print("A")\nelse:\n    print("B")`,
    options: ["A", "B", "True", "Error"],
    answer: "B",
    explanation: "Since x is 10, x > 15 is False. Therefore, the else block runs and prints 'B'."
  },
  {
    id: "conditionals_medium_2",
    topic: "conditionals",
    difficulty: "medium",
    type: "fitb",
    question: "The statement used to check multiple consecutive conditions is __________.",
    answer: "elif",
    explanation: "Multiple elif blocks can be chained between if and else."
  },
  {
    id: "conditionals_medium_3",
    topic: "conditionals",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this code?",
    code: `marks = 85\nif marks >= 90:\n    print("A")\nelif marks >= 80:\n    print("B")\nelse:\n    print("C")`,
    options: ["A", "B", "C", "Error"],
    answer: "B",
    explanation: "marks is 85. marks >= 90 is False. marks >= 80 is True, so 'B' is printed."
  },
  {
    id: "conditionals_hard_1",
    topic: "conditionals",
    difficulty: "hard",
    type: "mcq",
    question: "What is the output of this code?",
    code: `x = 5\nif x > 10:\n    print("A")\nelif x > 3:\n    print("B")\nelif x > 1:\n    print("C")\nelse:\n    print("D")`,
    options: ["A", "B", "C", "D"],
    answer: "B",
    explanation: "The first condition that evaluates to True is executed. x > 3 (5 > 3) is True, so it prints 'B' and exits the chain."
  },
  {
    id: "conditionals_hard_2",
    topic: "conditionals",
    difficulty: "hard",
    type: "fitb",
    question: "What does this print? `num = 8\\n if num % 2 == 0:\\n     print(\"Even\")\\n else:\\n     print(\"Odd\")`",
    answer: "Even",
    explanation: "8 % 2 equals 0. Thus the condition is True and 'Even' is printed."
  },

  // ==================== LOOPS ====================
  {
    id: "loops_easy_1",
    topic: "loops",
    difficulty: "easy",
    type: "mcq",
    question: "Which loop is used to iterate over a sequence (list, range, string)?",
    options: ["if", "while", "for", "else"],
    answer: "C",
    explanation: "A for loop iterates over elements of any sequence in order."
  },
  {
    id: "loops_easy_2",
    topic: "loops",
    difficulty: "easy",
    type: "fitb",
    question: "A loop that runs while a condition remains True is a __________ loop.",
    answer: "while",
    explanation: "A while loop tests its condition before executing the loop body."
  },
  {
    id: "loops_easy_3",
    topic: "loops",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of this loop?",
    code: `for i in range(3):\n    print(i)`,
    options: ["1 2 3", "0 1 2", "0 1 2 3", "3 2 1"],
    answer: "B",
    explanation: "range(3) yields integers from 0 up to (but not including) 3: 0, 1, 2."
  },
  {
    id: "loops_easy_4",
    topic: "loops",
    difficulty: "easy",
    type: "fitb",
    question: "`range(5)` generates numbers from __________ to __________. (Use format 'X to Y')",
    answer: "0 to 4",
    explanation: "By default, range(N) starts at 0 and ends at N-1."
  },
  {
    id: "loops_easy_5",
    topic: "loops",
    difficulty: "easy",
    type: "mcq",
    question: "Which keyword terminates a loop immediately?",
    options: ["stop", "continue", "break", "exit"],
    answer: "C",
    explanation: "The break statement jumps out of the innermost enclosing loop."
  },
  {
    id: "loops_easy_6",
    topic: "loops",
    difficulty: "easy",
    type: "fitb",
    question: "The body of code inside a loop must be __________.",
    answer: "indented",
    explanation: "Like conditionals, loops define scope blocks using indentation."
  },
  {
    id: "loops_easy_7",
    topic: "loops",
    difficulty: "easy",
    type: "mcq",
    question: "How many times does this loop run?",
    code: `for i in range(5):\n    print(i)`,
    options: ["4", "5", "6", "Infinite"],
    answer: "B",
    explanation: "range(5) contains five elements (0, 1, 2, 3, 4), so the loop runs 5 times."
  },
  {
    id: "loops_medium_1",
    topic: "loops",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `i = 1\nwhile i <= 3:\n    print(i)\n    i += 1`,
    options: ["1 2 3", "0 1 2", "1 2", "Infinite"],
    answer: "A",
    explanation: "i goes from 1 to 2 to 3. At 4, the condition i <= 3 is False, and the loop stops."
  },
  {
    id: "loops_medium_2",
    topic: "loops",
    difficulty: "medium",
    type: "fitb",
    question: "The keyword used to skip the current iteration and move to the next is __________.",
    answer: "continue",
    explanation: "continue stops the current iteration and jumps to the next condition evaluation/element."
  },
  {
    id: "loops_medium_3",
    topic: "loops",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this loop?",
    code: `for ch in "CAT":\n    print(ch)`,
    options: ["CAT", "C A T", "CATCAT", "Error"],
    answer: "B",
    explanation: "Strings are iterable. Iterating prints each character on a new line (shown here as C A T)."
  },
  {
    id: "loops_hard_1",
    topic: "loops",
    difficulty: "hard",
    type: "mcq",
    question: "What is the output of this loop?",
    code: `for i in range(1, 6):\n    if i == 3:\n        break\n    print(i)`,
    options: ["1 2 3 4 5", "1 2", "3 4 5", "No output"],
    answer: "B",
    explanation: "When i is 3, break triggers. Only 1 and 2 are printed."
  },
  {
    id: "loops_hard_2",
    topic: "loops",
    difficulty: "hard",
    type: "fitb",
    question: "What is the output of this program? `total = 0\\n for i in range(1, 5):\\n     total += i\\n print(total)`",
    answer: "10",
    explanation: "range(1, 5) yields 1, 2, 3, 4. Adding them: 1 + 2 + 3 + 4 = 10."
  },

  // ==================== STRINGS ====================
  {
    id: "strings_easy_1",
    topic: "strings",
    difficulty: "easy",
    type: "mcq",
    question: "Which data type stores textual data?",
    options: ["int", "float", "str", "bool"],
    answer: "C",
    explanation: "Strings, represented as 'str', are used for storing text."
  },
  {
    id: "strings_easy_2",
    topic: "strings",
    difficulty: "easy",
    type: "fitb",
    question: "A string can be enclosed in __________ or double quotes.",
    answer: "single quotes",
    explanation: "Python accepts either single (') or double (\") quotes for string literals."
  },
  {
    id: "strings_easy_3",
    topic: "strings",
    difficulty: "easy",
    type: "mcq",
    question: "Which is a valid string literal?",
    options: ["123", "True", '"Python"', "3.14"],
    answer: "C",
    explanation: "Enclosing text in quotes makes it a string."
  },
  {
    id: "strings_easy_4",
    topic: "strings",
    difficulty: "easy",
    type: "fitb",
    question: "The function used to find string length (number of characters) is __________.",
    answer: "len()",
    explanation: "len(string) returns the length of a string."
  },
  {
    id: "strings_easy_5",
    topic: "strings",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `s = "Hello"\nprint(s[0])`,
    options: ["H", "e", "Hello", "Error"],
    answer: "A",
    explanation: "String indices are 0-based. The character at index 0 is 'H'."
  },
  {
    id: "strings_easy_6",
    topic: "strings",
    difficulty: "easy",
    type: "fitb",
    question: "String indexing starts from what number?",
    answer: "0",
    explanation: "All indexing in Python sequences (strings, lists, tuples) starts at 0."
  },
  {
    id: "strings_easy_7",
    topic: "strings",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of `print(\"Hi\" * 3)`?",
    options: ["HiHiHi", "Hi 3", "HiHi", "Error"],
    answer: "A",
    explanation: "Multiplying a string by an integer duplicates/repeats it."
  },
  {
    id: "strings_medium_1",
    topic: "strings",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this string slice?",
    code: `s = "Python"\nprint(s[1:4])`,
    options: ["Pyt", "yth", "tho", "Python"],
    answer: "B",
    explanation: "s[1:4] extracts index 1 up to but excluding index 4: 'y', 't', 'h'."
  },
  {
    id: "strings_medium_2",
    topic: "strings",
    difficulty: "medium",
    type: "fitb",
    question: "The arithmetic operator used to concatenate (join) strings is __________.",
    answer: "+",
    explanation: "The addition operator + combines two string operands."
  },
  {
    id: "strings_medium_3",
    topic: "strings",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this code?",
    code: `s = "python"\nprint(s.upper())`,
    options: ["python", "Python", "PYTHON", "Error"],
    answer: "C",
    explanation: "The .upper() method returns a copy of the string with all characters in uppercase."
  },
  {
    id: "strings_hard_1",
    topic: "strings",
    difficulty: "hard",
    type: "mcq",
    question: "What does negative indexing `s[-1]` return for the string below?",
    code: `s = "Programming"\nprint(s[-1])`,
    options: ["P", "g", "n", "Error"],
    answer: "B",
    explanation: "Negative indices start from the end: -1 represents the very last character ('g')."
  },
  {
    id: "strings_hard_2",
    topic: "strings",
    difficulty: "hard",
    type: "fitb",
    question: "What does reverse string slice print? `s = \"Python\"\\n print(s[::-1])`",
    answer: "nohtyP",
    explanation: "A step of -1 ([::-1]) traverses the string in reverse, reversing it."
  },

  // ==================== LISTS ====================
  {
    id: "lists_easy_1",
    topic: "lists",
    difficulty: "easy",
    type: "mcq",
    question: "Which symbol creates a list?",
    options: ["{ }", "( )", "[ ]", "< >"],
    answer: "C",
    explanation: "Lists are created by placing comma-separated values inside square brackets [ ]."
  },
  {
    id: "lists_easy_2",
    topic: "lists",
    difficulty: "easy",
    type: "fitb",
    question: "A list is an __________ collection of items (maintains insertion sequence).",
    answer: "ordered",
    explanation: "Lists maintain the order of insertion, meaning they are ordered."
  },
  {
    id: "lists_easy_3",
    topic: "lists",
    difficulty: "easy",
    type: "mcq",
    question: "Which is a valid list in Python?",
    options: ['["Apple", "Banana", "Mango"]', '("Apple", "Banana", "Mango")', '{Apple, Banana, Mango}', '"Apple, Banana, Mango"'],
    answer: "A",
    explanation: "Only choice A utilizes square brackets and correctly quoted strings."
  },
  {
    id: "lists_easy_4",
    topic: "lists",
    difficulty: "easy",
    type: "fitb",
    question: "The first element of a list has index __________.",
    answer: "0",
    explanation: "Python indices start at 0."
  },
  {
    id: "lists_easy_5",
    topic: "lists",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `fruits = ["Apple", "Banana", "Mango"]\nprint(fruits[1])`,
    options: ["Apple", "Banana", "Mango", "Error"],
    answer: "B",
    explanation: "Index 0 is Apple, index 1 is Banana, and index 2 is Mango."
  },
  {
    id: "lists_easy_6",
    topic: "lists",
    difficulty: "easy",
    type: "fitb",
    question: "What method adds an item to the end of a list? (Include parentheses)",
    answer: "append()",
    explanation: "list.append(item) inserts the item at the very end of the list."
  },
  {
    id: "lists_easy_7",
    topic: "lists",
    difficulty: "easy",
    type: "mcq",
    question: "How many elements are inside this list?",
    code: `numbers = [10, 20, 30, 40]`,
    options: ["3", "4", "5", "10"],
    answer: "B",
    explanation: "There are four numbers inside the list: 10, 20, 30, 40."
  },
  {
    id: "lists_medium_1",
    topic: "lists",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this list length check?",
    code: `numbers = [10, 20, 30, 40]\nprint(len(numbers))`,
    options: ["3", "5", "4", "Error"],
    answer: "C",
    explanation: "len() returns the total count of elements, which is 4."
  },
  {
    id: "lists_medium_2",
    topic: "lists",
    difficulty: "medium",
    type: "fitb",
    question: "The method to remove and return the last element of a list is __________.",
    answer: "pop()",
    explanation: "pop() removes the final item in a list if no index is specified."
  },
  {
    id: "lists_medium_3",
    topic: "lists",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `nums = [1, 2, 3]\nnums.append(4)\nprint(nums)`,
    options: ["[1, 2, 3]", "[4, 1, 2, 3]", "[1, 2, 3, 4]", "Error"],
    answer: "C",
    explanation: "append(4) puts 4 at the end, resulting in [1, 2, 3, 4]."
  },
  {
    id: "lists_hard_1",
    topic: "lists",
    difficulty: "hard",
    type: "mcq",
    question: "What is the output of this list slice?",
    code: `numbers = [10, 20, 30, 40, 50]\nprint(numbers[1:4])`,
    options: ["[10, 20, 30]", "[20, 30, 40]", "[20, 30, 40, 50]", "[30, 40, 50]"],
    answer: "B",
    explanation: "Slicing from index 1 to 4 extracts indices 1, 2, and 3: [20, 30, 40]."
  },
  {
    id: "lists_hard_2",
    topic: "lists",
    difficulty: "hard",
    type: "fitb",
    question: "What is printed? `numbers = [5, 10, 15]\\n numbers[1] = 20\\n print(numbers)` (Lists are mutable)",
    answer: "[5, 20, 15]",
    explanation: "Since lists are mutable, we can overwrite index 1 (10) with 20."
  },

  // ==================== TUPLES ====================
  {
    id: "tuples_easy_1",
    topic: "tuples",
    difficulty: "easy",
    type: "mcq",
    question: "Which symbol creates a tuple?",
    options: ["[ ]", "{ }", "( )", "< >"],
    answer: "C",
    explanation: "Tuples are defined using standard parentheses ( )."
  },
  {
    id: "tuples_easy_2",
    topic: "tuples",
    difficulty: "easy",
    type: "fitb",
    question: "A tuple is an __________ collection of items (like a list, but immutable).",
    answer: "ordered",
    explanation: "Tuples preserve the sequence of item insertions."
  },
  {
    id: "tuples_easy_3",
    topic: "tuples",
    difficulty: "easy",
    type: "mcq",
    question: "Which is a valid tuple?",
    options: ["[1, 2, 3]", "(1, 2, 3)", "{1, 2, 3}", "<1, 2, 3>"],
    answer: "B",
    explanation: "Tuples are written as comma-separated values inside parentheses."
  },
  {
    id: "tuples_easy_4",
    topic: "tuples",
    difficulty: "easy",
    type: "fitb",
    question: "The first element of a tuple has index __________.",
    answer: "0",
    explanation: "Tuple indexing is 0-based."
  },
  {
    id: "tuples_easy_5",
    topic: "tuples",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `t = ("Apple", "Banana", "Mango")\nprint(t[1])`,
    options: ["Apple", "Banana", "Mango", "Error"],
    answer: "B",
    explanation: "Index 1 references the second item, which is Banana."
  },
  {
    id: "tuples_easy_6",
    topic: "tuples",
    difficulty: "easy",
    type: "fitb",
    question: "What function finds the number of elements in a tuple? (Include parentheses)",
    answer: "len()",
    explanation: "len(tuple) returns the element count of the tuple."
  },
  {
    id: "tuples_easy_7",
    topic: "tuples",
    difficulty: "easy",
    type: "mcq",
    question: "How many elements in this tuple?",
    code: `t = (10, 20, 30, 40)`,
    options: ["3", "4", "5", "10"],
    answer: "B",
    explanation: "There are four items in the tuple: 10, 20, 30, 40."
  },
  {
    id: "tuples_medium_1",
    topic: "tuples",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of `t * 2`?",
    code: `t = (1, 2, 3)\nprint(t * 2)`,
    options: ["(1, 2, 3)", "(1, 2, 3, 1, 2, 3)", "(2, 4, 6)", "Error"],
    answer: "B",
    explanation: "Multiplying a tuple duplicates the elements in sequence rather than multiplying values."
  },
  {
    id: "tuples_medium_2",
    topic: "tuples",
    difficulty: "medium",
    type: "fitb",
    question: "Tuples cannot be altered after creation, making them __________.",
    answer: "immutable",
    explanation: "Tuples are write-once, read-many structures. They cannot be modified in-place."
  },
  {
    id: "tuples_medium_3",
    topic: "tuples",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this code?",
    code: `t = ("Python", "Java", "C++")\nprint(t[-1])`,
    options: ["Python", "Java", "C++", "Error"],
    answer: "C",
    explanation: "Index -1 indicates the final element, 'C++'."
  },
  {
    id: "tuples_hard_1",
    topic: "tuples",
    difficulty: "hard",
    type: "mcq",
    question: "Which expression correctly creates a tuple containing only one element?",
    options: ["(5)", "[5]", "(5,)", "{5}"],
    answer: "C",
    explanation: "A trailing comma (5,) is required to distinguish a single-item tuple from parenthesized integer arithmetic (5)."
  },
  {
    id: "tuples_hard_2",
    topic: "tuples",
    difficulty: "hard",
    type: "fitb",
    question: "What is the slice printed? `t = (10, 20, 30, 40, 50)\\n print(t[1:4])`",
    answer: "(20, 30, 40)",
    explanation: "Slicing indices 1 to 3 yields (20, 30, 40) as a tuple."
  },

  // ==================== DICTIONARIES ====================
  {
    id: "dicts_easy_1",
    topic: "dicts",
    difficulty: "easy",
    type: "mcq",
    question: "Which symbol creates a dictionary?",
    options: ["[ ]", "( )", "{ }", "< >"],
    answer: "C",
    explanation: "Curly brackets { } are used to define key-value associations in dictionaries."
  },
  {
    id: "dicts_easy_2",
    topic: "dicts",
    difficulty: "easy",
    type: "fitb",
    question: "A dictionary stores mappings of __________ and value pairs.",
    answer: "key",
    explanation: "Data in dictionaries is structured into unique keys bound to values."
  },
  {
    id: "dicts_easy_3",
    topic: "dicts",
    difficulty: "easy",
    type: "mcq",
    question: "Which is a valid dictionary?",
    options: ["[1, 2, 3]", "(1, 2, 3)", '{"name": "John", "age": 15}', "{1, 2, 3}"],
    answer: "C",
    explanation: "Choice C has key-value pairs formatted as 'key': value inside curly braces."
  },
  {
    id: "dicts_easy_4",
    topic: "dicts",
    difficulty: "easy",
    type: "fitb",
    question: "To retrieve a value from a dictionary, we must use its unique __________.",
    answer: "key",
    explanation: "Keys act as labels to index values, e.g. dictionary[key]."
  },
  {
    id: "dicts_easy_5",
    topic: "dicts",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `student = {"name": "Alice", "age": 14}\nprint(student["name"])`,
    options: ["Alice", "name", "14", "Error"],
    answer: "A",
    explanation: "Accessing key 'name' returns the mapped string, 'Alice'."
  },
  {
    id: "dicts_easy_6",
    topic: "dicts",
    difficulty: "easy",
    type: "fitb",
    question: "What dictionary method retrieves a list of all keys? (Include parentheses)",
    answer: "keys()",
    explanation: "dict.keys() returns a view object displaying all dictionary keys."
  },
  {
    id: "dicts_easy_7",
    topic: "dicts",
    difficulty: "easy",
    type: "mcq",
    question: "How many key-value pairs are stored in this dictionary?",
    code: `data = {"a": 1, "b": 2, "c": 3}`,
    options: ["2", "3", "4", "1"],
    answer: "B",
    explanation: "There are three pairs in total: 'a'->1, 'b'->2, and 'c'->3."
  },
  {
    id: "dicts_medium_1",
    topic: "dicts",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this dictionary lookup?",
    code: `car = {"brand": "Toyota", "year": 2024}\nprint(car.get("brand"))`,
    options: ["brand", "Toyota", "year", "Error"],
    answer: "B",
    explanation: "The get() method retrieves the value associated with the key 'brand'."
  },
  {
    id: "dicts_medium_2",
    topic: "dicts",
    difficulty: "medium",
    type: "fitb",
    question: "To insert or overwrite a key-value pair, use the basic assignment operator __________.",
    answer: "=",
    explanation: "dict[new_key] = value binds the value to the key."
  },
  {
    id: "dicts_medium_3",
    topic: "dicts",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this code?",
    code: `d = {"x": 10, "y": 20}\nd["y"] = 30\nprint(d["y"])`,
    options: ["20", "10", "30", "Error"],
    answer: "C",
    explanation: "d['y'] = 30 updates the value of 'y' from 20 to 30."
  },
  {
    id: "dicts_hard_1",
    topic: "dicts",
    difficulty: "hard",
    type: "mcq",
    question: "What does len() return for this dictionary?",
    code: `d = {"a": 1, "b": 2}\nprint(len(d))`,
    options: ["1", "2", "3", "Error"],
    answer: "B",
    explanation: "len() counts the number of key-value pairs in the dictionary, which is 2."
  },
  {
    id: "dicts_hard_2",
    topic: "dicts",
    difficulty: "hard",
    type: "fitb",
    question: "What is printed? `student = {\"name\": \"Rahul\", \"marks\": 95}\\n print(student[\"marks\"] + 5)`",
    answer: "100",
    explanation: "student['marks'] is 95. Adding 5 results in 100."
  },

  // ==================== SETS ====================
  {
    id: "sets_easy_1",
    topic: "sets",
    difficulty: "easy",
    type: "mcq",
    question: "Which symbol creates a set with values in it?",
    options: ["[ ]", "( )", "{ }", "< >"],
    answer: "C",
    explanation: "Sets use curly braces { }, but contain single items instead of key:value pairs."
  },
  {
    id: "sets_easy_2",
    topic: "sets",
    difficulty: "easy",
    type: "fitb",
    question: "A set is an __________ collection of unique items.",
    answer: "unordered",
    explanation: "Sets do not track insertion order and cannot contain duplicates."
  },
  {
    id: "sets_easy_3",
    topic: "sets",
    difficulty: "easy",
    type: "mcq",
    question: "Which is a valid set literal?",
    options: ["[1, 2, 3]", "(1, 2, 3)", "{1, 2, 3}", '"1, 2, 3"'],
    answer: "C",
    explanation: "Curly braces containing comma-separated elements define a set."
  },
  {
    id: "sets_easy_4",
    topic: "sets",
    difficulty: "easy",
    type: "fitb",
    question: "Sets automatically discard __________ values (no element occurs twice).",
    answer: "duplicate",
    explanation: "Sets enforce unique elements and ignore repeating entries."
  },
  {
    id: "sets_easy_5",
    topic: "sets",
    difficulty: "easy",
    type: "mcq",
    question: "What is the output of this Python code?",
    code: `s = {10, 20, 30}\nprint(len(s))`,
    options: ["2", "3", "4", "Error"],
    answer: "B",
    explanation: "There are three elements in the set, so len() returns 3."
  },
  {
    id: "sets_easy_6",
    topic: "sets",
    difficulty: "easy",
    type: "fitb",
    question: "What set method adds an item? (Include parentheses)",
    answer: "add()",
    explanation: "set.add(item) inserts a new item if it doesn't already exist in the set."
  },
  {
    id: "sets_easy_7",
    topic: "sets",
    difficulty: "easy",
    type: "mcq",
    question: "Which creates an empty set? (Note: {} creates an empty dictionary!)",
    options: ["{}", "[]", "set()", "()"],
    answer: "C",
    explanation: "{} is reserved for an empty dict. You must use set() to create an empty set."
  },
  {
    id: "sets_medium_1",
    topic: "sets",
    difficulty: "medium",
    type: "mcq",
    question: "What is the output of this set definition?",
    code: `s = {1, 2, 2, 3}\nprint(s)`,
    options: ["{1, 2, 2, 3}", "{1, 2, 3}", "{2, 3}", "Error"],
    answer: "B",
    explanation: "Sets remove duplicates. The repeated 2 is stored only once, producing {1, 2, 3}."
  },
  {
    id: "sets_medium_2",
    topic: "sets",
    difficulty: "medium",
    type: "fitb",
    question: "The method to remove an element without throwing an error if it doesn't exist is __________.",
    answer: "discard()",
    explanation: "Unlike remove(), discard() is safe and does not raise a KeyError."
  },
  {
    id: "sets_medium_3",
    topic: "sets",
    difficulty: "medium",
    type: "mcq",
    question: "What does this union print?",
    code: `a = {1, 2, 3}\nb = {3, 4, 5}\nprint(a.union(b))`,
    options: ["{1, 2, 3}", "{3}", "{1, 2, 3, 4, 5}", "Error"],
    answer: "C",
    explanation: "Union merges all distinct elements from both sets: {1, 2, 3, 4, 5}."
  },
  {
    id: "sets_hard_1",
    topic: "sets",
    difficulty: "hard",
    type: "mcq",
    question: "What does this intersection print?",
    code: `a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a.intersection(b))`,
    options: ["{1, 4}", "{2, 3}", "{1, 2, 3, 4}", "set()"],
    answer: "B",
    explanation: "Intersection extracts common elements, which are 2 and 3: {2, 3}."
  },
  {
    id: "sets_hard_2",
    topic: "sets",
    difficulty: "hard",
    type: "fitb",
    question: "What is the set size printed? `s = {10, 20, 30}\\n s.add(40)\\n s.remove(20)\\n print(len(s))`",
    answer: "3",
    explanation: "s starts with {10, 20, 30}. Adding 40 makes it {10, 20, 30, 40}. Removing 20 leaves {10, 30, 40}, which has size 3."
  }
];
