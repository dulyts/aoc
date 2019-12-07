from itertools import permutations 

OUTPUT = []

def organize(program, a, b):
    program[1] = a
    program[2] = b

def getValue(program, inputIndex, paramIndex):
    command = str(program[inputIndex]).zfill(5)
    if paramIndex == 0:
        # print('getValue', command)
        return int(command[-2:])
    else:
        if int(command[-2-paramIndex:-2-paramIndex+1]) == 0:
            # print('getValue', program[program[inputIndex + paramIndex]], inputIndex, paramIndex, int(command[-2-paramIndex:-2-paramIndex+1]))
            return program[program[inputIndex + paramIndex]]
        else:
            # print('getValue', program[inputIndex + paramIndex], inputIndex, paramIndex, int(command[-2-paramIndex:-2-paramIndex+1]))
            return program[inputIndex + paramIndex]

def part1(program, input):
    i = 0
    while i<len(program) and program[i] != 99:
        # process(program, program[i], program[i+1], program[i+2], program[i+3])
        i = process(program, i, input)
        # print('inc', inc)
        # print('-----------------')
        # i = i + inc
    return (program[0], program[1], program[2])

# def calc(input, command, input1Value, input2Value, outputIndex):
#     if command == 1:
#         return input1Value + input2Value
#     elif command == 2:
#         return input1Value * input2Value
#     elif command == 3:

def process(program, i, input):
    cmd = getValue(program, i, 0)
    if cmd == 1:
        # print('command1', i, getValue(program, i, 0), getValue(program, i, 1), getValue(program, i, 2), getValue(program, i, 3))
        # print('output: ', program[i+3], ' = ', getValue(program, i, 1), '+', getValue(program, i, 2))
        program[program[i+3]] = getValue(program, i, 1) + getValue(program, i, 2)
        return i+4
    elif cmd == 2:
        # print('command2', i, getValue(program, i, 0), getValue(program, i, 1), getValue(program, i, 2), getValue(program, i, 3))
        # print('output: ', program[i+3], ' = ', getValue(program, i, 1), '+', getValue(program, i, 2))
        program[program[i+3]] = getValue(program, i, 1) * getValue(program, i, 2)
        return i+4
    elif cmd == 3:
        # print('command3', i, getValue(program, i, 0), getValue(program, i, 1))
        # program[program[i+1]] = int(input())
        program[program[i+1]] = int(input.pop(0))
        # program[program[i+3]] = 1
        return i+2
    elif cmd == 4:
        # print('command4', program[i+1], getValue(program, i, 1))
        OUTPUT.append(getValue(program, i, 1))
        return i+2
    elif cmd == 5:
        print('command5 input: ', program[i], program[i+1], program[i+2])
        if getValue(program, i, 1) != 0:
        # if program[i+1] != 0:
            print('command5 input: ', getValue(program, i, 1), ' ptrTo: ', getValue(program, i, 2))
            return getValue(program, i, 2)
            # return program[i+2]
        return i+3
    elif cmd == 6:
        print('command6 input: ', program[i], program[i+1], program[i+2])
        if getValue(program, i, 1) == 0:
        # if program[i+1] != 0:
            print('command6 input: ', getValue(program, i, 1), ' ptrTo: ', getValue(program, i, 2))
            return getValue(program, i, 2)
            # return program[i+2]
        return i+3
    elif cmd == 7:
        print('command7', getValue(program, i, 1),' < ', getValue(program, i, 2), getValue(program, i, 1) < getValue(program, i, 2) )
        program[program[i+3]] = (1 if getValue(program, i, 1) < getValue(program, i, 2) else 0)
        return i+4
    elif cmd == 8:
        print('command8', getValue(program, i, 1),' == ', getValue(program, i, 2), getValue(program, i, 1) == getValue(program, i, 2) )
        program[program[i+3]] = (1 if getValue(program, i, 1) == getValue(program, i, 2) else 0)
        return i+4
    else:
        print('wtf??', i)


def read_file():
    with open("input.txt") as f:
        program = f.readline().strip().split(',')
    
    # program = '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'.split(',')
    # program = '3,9,8,9,10,9,4,9,99,-1,8'.split(',')
    # program = '3,9,7,9,10,9,4,9,99,-1,8'.split(',')
    # program = '3,3,1108,-1,8,3,4,3,99'.split(',')
    # program = '3,3,1107,-1,8,3,4,3,99'.split(',')
    # program = '3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9'.split(',')
    # program = '3,3,1105,-1,9,1101,0,0,12,4,12,99,1'.split(',')
    # program = '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0'.split(',')
    # program = '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0'.split(',')
    for i in range(0, len(program)):
        program[i] = int(program[i])
    return program

max_sum = 0
max_solution = None
for perm in list(permutations('01234', 5)):
    last_output = 0
    for ampInput in perm:
        program = read_file()
        # organize(program, 12, 2)
        result = part1(program, [ampInput, last_output])
        # print(result[0])
        print('OUTPUT:', OUTPUT[-1])
        # print('OUTPUT:', OUTPUT)
        last_output = OUTPUT[-1]

    if last_output > max_sum:
        max_sum = last_output
        max_solution = perm

print(max_sum, max_solution)




# def part2():
#     for i in range(0,99):
#         for j in range(0,99):
#             program = read_file()
#             organize(program, i, j)
#             result = part1(program)
#             if result[0] == 19690720:
#                 print(100 * result[1] + result[2])

# part2()