def read_file(file):
    with open(filename) as file:
        lines = [line[:-1].replace(" ", "") for line in file]
        return lines

def process_op(res, op, val):
    if op == "+":
        return res + val
    if op == "*":
        return res * val

def process(l):
    i = 0
    res = 0
    op = "+"
    while i < len(l):
        if l[i].isnumeric():
            # print(res, "+" if op == "add" else "*", l[i], process_op(res, op, int(l[i])))
            res = process_op(res, op, int(l[i]))
        if l[i] == "(":
            r = process(l[i+1:])
            # print(res, "+" if op == "add" else "*", r[0], process_op(res, op, r[0]), i + r[1] + 1, l[i + r[1] + 1])
            res = process_op(res, op, r[0])
            i = i + r[1] + 2
            continue
        if l[i] == ")":
            return (res, i)
        if l[i] in ["+", "*"]:
            op = l[i]
        i += 1
    return (res, i)

def part1(data):
    c = 0
    for d in data:
        asd = process(d)
        c += asd[0]
    print(c)

OPERATORS = set(['+', '*', '(', ')'])  # set of operators
PRIORITY = {'+':2, '*':1} # dictionary having priorities 

def infix_to_postfix(expression): #input expression
    stack = [] # initially stack empty
    output = '' # initially output empty

    for ch in expression:
        if ch not in OPERATORS:  # if an operand then put it directly in postfix expression
            output+= ch
        elif ch=='(':  # else operators should be put in stack
            stack.append('(')
        elif ch==')':
            while stack and stack[-1]!= '(':
                output+=stack.pop()
            stack.pop()
        else:
            # lesser priority can't be on top on higher or equal priority    
             # so pop and put in output   
            while stack and stack[-1]!='(' and PRIORITY[ch]<=PRIORITY[stack[-1]]:
                output+=stack.pop()
            stack.append(ch)
    while stack:
        output+=stack.pop()
    return output

def part2(data):
    c = 0
    for d in data:
        postfix_expression = infix_to_postfix(d)
        
        stack = []
        for token in postfix_expression:
            if token.isnumeric():
                stack.append(int(token))
            else:
                operand2 = stack.pop()
                operand1 = stack.pop()
                result = doMath(token,operand1,operand2)
                stack.append(result)
        c += stack.pop()
    print(c)

def doMath(op, op1, op2):
    if op == "*":
        return op1 * op2
    if op == "+":
        return op1 + op2

filename = "input.txt"
# filename = "sample_0.txt"

data = read_file(filename)
# print(data)
part1(data)
part2(data)