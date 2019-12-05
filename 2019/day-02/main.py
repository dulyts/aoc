def organize(input, a, b):
    input[1] = a
    input[2] = b

def part1(input):
    i = 0
    while i<len(input) and input[i] != 99:
        process(input, input[i], input[i+1], input[i+2], input[i+3])
        i = i + 4
    return (input[0], input[1], input[2])

def calc(input, command, input1Index, input2Index, outputIndex):
    if command == 1:
        return input[input1Index] + input[input2Index]
    else:
        return input[input1Index] * input[input2Index]

def process(input, command, input1Index, input2Index, outputIndex):
        input[outputIndex] = calc(input, command, input1Index, input2Index, outputIndex)
        return input[outputIndex]


def read_file():
    with open("input.txt") as f:
        input = f.readline().strip().split(',')
    for i in range(0, len(input)):
        input[i] = int(input[i])
    return input

input = read_file()
organize(input, 12, 2)
result = part1(input)
print(result[0])



def part2():
    for i in range(0,99):
        for j in range(0,99):
            input = read_file()
            organize(input, i, j)
            result = part1(input)
            if result[0] == 19690720:
                print(100 * result[1] + result[2])

part2()