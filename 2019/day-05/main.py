
OUTPUT = []

def organize(inputList, a, b):
    inputList[1] = a
    inputList[2] = b

def getValue(inputList, inputIndex, paramIndex):
    command = str(inputList[inputIndex]).zfill(5)
    if paramIndex == 0:
        # print('getValue', command)
        return int(command[-2:])
    else:
        if int(command[-2-paramIndex:-2-paramIndex+1]) == 0:
            # print('getValue', inputList[inputList[inputIndex + paramIndex]], inputIndex, paramIndex, int(command[-2-paramIndex:-2-paramIndex+1]))
            return inputList[inputList[inputIndex + paramIndex]]
        else:
            # print('getValue', inputList[inputIndex + paramIndex], inputIndex, paramIndex, int(command[-2-paramIndex:-2-paramIndex+1]))
            return inputList[inputIndex + paramIndex]

def part1(inputList):
    i = 0
    while i<len(inputList) and inputList[i] != 99:
        # process(inputList, inputList[i], inputList[i+1], inputList[i+2], inputList[i+3])
        i = process(inputList, i)
        # print('inc', inc)
        # print('-----------------')
        # i = i + inc
    return (inputList[0], inputList[1], inputList[2])

# def calc(input, command, input1Value, input2Value, outputIndex):
#     if command == 1:
#         return input1Value + input2Value
#     elif command == 2:
#         return input1Value * input2Value
#     elif command == 3:

def process(inputList, i):
    cmd = getValue(inputList, i, 0)
    if cmd == 1:
        # print('command1', i, getValue(inputList, i, 0), getValue(inputList, i, 1), getValue(inputList, i, 2), getValue(inputList, i, 3))
        # print('output: ', inputList[i+3], ' = ', getValue(inputList, i, 1), '+', getValue(inputList, i, 2))
        inputList[inputList[i+3]] = getValue(inputList, i, 1) + getValue(inputList, i, 2)
        return i+4
    elif cmd == 2:
        # print('command2', i, getValue(inputList, i, 0), getValue(inputList, i, 1), getValue(inputList, i, 2), getValue(inputList, i, 3))
        # print('output: ', inputList[i+3], ' = ', getValue(inputList, i, 1), '+', getValue(inputList, i, 2))
        inputList[inputList[i+3]] = getValue(inputList, i, 1) * getValue(inputList, i, 2)
        return i+4
    elif cmd == 3:
        # print('command3', i, getValue(inputList, i, 0), getValue(inputList, i, 1))
        inputList[inputList[i+1]] = int(input())
        # inputList[inputList[i+3]] = 1
        return i+2
    elif cmd == 4:
        # print('command4', inputList[i+1], getValue(inputList, i, 1))
        OUTPUT.append(getValue(inputList, i, 1))
        return i+2
    elif cmd == 5:
        print('command5 input: ', inputList[i], inputList[i+1], inputList[i+2])
        if getValue(inputList, i, 1) != 0:
        # if inputList[i+1] != 0:
            print('command5 input: ', getValue(inputList, i, 1), ' ptrTo: ', getValue(inputList, i, 2))
            return getValue(inputList, i, 2)
            # return inputList[i+2]
        return i+3
    elif cmd == 6:
        print('command6 input: ', inputList[i], inputList[i+1], inputList[i+2])
        if getValue(inputList, i, 1) == 0:
        # if inputList[i+1] != 0:
            print('command6 input: ', getValue(inputList, i, 1), ' ptrTo: ', getValue(inputList, i, 2))
            return getValue(inputList, i, 2)
            # return inputList[i+2]
        return i+3
    elif cmd == 7:
        print('command7', getValue(inputList, i, 1),' < ', getValue(inputList, i, 2), getValue(inputList, i, 1) < getValue(inputList, i, 2) )
        inputList[inputList[i+3]] = (1 if getValue(inputList, i, 1) < getValue(inputList, i, 2) else 0)
        return i+4
    elif cmd == 8:
        print('command8', getValue(inputList, i, 1),' == ', getValue(inputList, i, 2), getValue(inputList, i, 1) == getValue(inputList, i, 2) )
        inputList[inputList[i+3]] = (1 if getValue(inputList, i, 1) == getValue(inputList, i, 2) else 0)
        return i+4
    else:
        print('wtf??', i)


def read_file():
    with open("input.txt") as f:
        inputList = f.readline().strip().split(',')
    
    # inputList = '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'.split(',')
    # inputList = '3,9,8,9,10,9,4,9,99,-1,8'.split(',')
    # inputList = '3,9,7,9,10,9,4,9,99,-1,8'.split(',')
    # inputList = '3,3,1108,-1,8,3,4,3,99'.split(',')
    # inputList = '3,3,1107,-1,8,3,4,3,99'.split(',')
    # inputList = '3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9'.split(',')
    # inputList = '3,3,1105,-1,9,1101,0,0,12,4,12,99,1'.split(',')
    for i in range(0, len(inputList)):
        inputList[i] = int(inputList[i])
    return inputList

inputList = read_file()
# organize(inputList, 12, 2)
result = part1(inputList)
print(result[0])
print('OUTPUT:', OUTPUT[-1])
print('OUTPUT:', OUTPUT)



# def part2():
#     for i in range(0,99):
#         for j in range(0,99):
#             inputList = read_file()
#             organize(inputList, i, j)
#             result = part1(inputList)
#             if result[0] == 19690720:
#                 print(100 * result[1] + result[2])

# part2()