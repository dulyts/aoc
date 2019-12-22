from os import system
from itertools import permutations, product
import time
from datetime import datetime

def timeit(method):
    def timed(*args, **kw):
        ts = time.time()
        tsd = datetime.now()
        result = method(*args, **kw)
        te = time.time()
        ted = datetime.now()
        print('%s %s %2.2f ms' % (method.__name__, (ted - tsd), (te - ts) * 1000.0))
        return result
    return timed

DEBUG = [
    # 'command'
    'error',
]

def debug_print(command, *args):
    if command in DEBUG:
        for p in args:
            print(p, end =" ")
        print('')

class Amp:
    def __init__(self, program, inp, id, relativeBase):
        self.id = id
        self.program = program
        self.halt = False
        self.ptr = 0
        self.input = inp
        self.relativeBase = relativeBase

    
    def __str__(self):
        return '[' + str(self.id) + ': halt: ' + str(self.halt) + ', PTR: ' + str(self.ptr) + ']'

OUTPUT = []

def getValue(amp, program, inputIndex, paramIndex):
    paramMode = program[inputIndex] % 10 ** (paramIndex + 2) // 10 ** (paramIndex + 1)
    if paramMode == 0:
        # print('getValue', program[program[inputIndex + paramIndex]], inputIndex, paramIndex, int(command[-2-paramIndex:-2-paramIndex+1]))
        return program[program[inputIndex + paramIndex]]

    elif paramMode == 1:
        # print('getValue', program[inputIndex + paramIndex], inputIndex, paramIndex, int(command[-2-paramIndex:-2-paramIndex+1]))
        return program[inputIndex + paramIndex]

    elif paramMode == 2:
        return program[amp.relativeBase + program[inputIndex + paramIndex]]
    else:
        print('WtfParamMode???', paramMode)

def getSetPos(amp, program, inputIndex, paramIndex):
    paramMode = program[inputIndex] % 10 ** (paramIndex + 2) // 10 ** (paramIndex + 1)
    if paramMode == 0:
        # print('getSetPos', program[program[inputIndex + paramIndex]], inputIndex, paramIndex, int(command[-2-paramIndex:-2-paramIndex+1]))
        return program[inputIndex + paramIndex]
    elif paramMode == 1:
        # print('getSetPos', program[inputIndex + paramIndex], inputIndex, paramIndex, int(command[-2-paramIndex:-2-paramIndex+1]))
        return inputIndex + paramIndex
    elif paramMode == 2:
        return amp.relativeBase + program[inputIndex + paramIndex]
    else:
        print('WtfsetParamMode???', paramMode)

# @timeit
def part1(amp):
    out = None
    while out == None and not amp.halt:
        # process(program, program[i], program[i+1], program[i+2], program[i+3])
        out = process(amp)
            # amp.ptr = 0
        # print('inc', inc)
        # print('-----------------')
        # i = i + inc
    return out
    # return (program[0], program[1], program[2])

def process(amp):
    program = amp.program
    cmd = program[amp.ptr] % 100
    if cmd == 1:
        # debug_print('command', 'command1', amp.ptr, getValue(amp, program, amp.ptr, 0), getValue(amp, program, amp.ptr, 1), getValue(amp, program, amp.ptr, 2), getValue(amp, program, amp.ptr, 3))
        program[getSetPos(amp, program, amp.ptr, 3)] = getValue(amp, program, amp.ptr, 1) + getValue(amp, program, amp.ptr, 2)
        amp.ptr = amp.ptr+4
    elif cmd == 2:
        # debug_print('command', 'command2', amp.ptr, getValue(amp, program, amp.ptr, 0), getValue(amp, program, amp.ptr, 1), getValue(amp, program, amp.ptr, 2), getValue(amp, program, amp.ptr, 3))
        program[getSetPos(amp, program, amp.ptr, 3)] = getValue(amp, program, amp.ptr, 1) * getValue(amp, program, amp.ptr, 2)
        amp.ptr = amp.ptr+4
    elif cmd == 3:
        # debug_print('command', 'command3', amp.ptr, getValue(amp, program, amp.ptr, 0), getValue(amp, program, amp.ptr, 1), 'input', amp.input)
        program[getSetPos(amp, program, amp.ptr, 1)] = int(amp.input.pop(0))
        # _ = system('cls') 
        # dump(table, N)
        amp.ptr = amp.ptr+2
    elif cmd == 4:
        output = getValue(amp, program, amp.ptr, 1)
        # debug_print('command', 'command4', amp.ptr, program[amp.ptr+1], getValue(amp, program, amp.ptr, 1), ' output ', output)
        OUTPUT.append(output)
        amp.ptr = amp.ptr+2
        return output
    elif cmd == 5:
        # debug_print('command', 'command5', amp.ptr, ' input: ', program[amp.ptr], program[amp.ptr+1], program[amp.ptr+2])
        if getValue(amp, program, amp.ptr, 1) != 0:
            # debug_print('command', 'command5 input: ', getValue(amp, program, amp.ptr, 1), ' ptrTo: ', getValue(amp, program, amp.ptr, 2))
            amp.ptr = getValue(amp, program, amp.ptr, 2)
        else:
            amp.ptr = amp.ptr+3
    elif cmd == 6:
        # debug_print('command', 'command6', amp.ptr, ' input: ', program[amp.ptr], program[amp.ptr+1], program[amp.ptr+2])
        if getValue(amp, program, amp.ptr, 1) == 0:
            # debug_print('command', 'command6 input: ', getValue(amp, program, amp.ptr, 1), ' ptrTo: ', getValue(amp, program, amp.ptr, 2))
            amp.ptr = getValue(amp, program, amp.ptr, 2)
        else:
            amp.ptr = amp.ptr+3
    elif cmd == 7:
        # debug_print('command', 'command7', amp.ptr, getValue(amp, program, amp.ptr, 1),' < ', getValue(amp, program, amp.ptr, 2), getValue(amp, program, amp.ptr, 1) < getValue(amp, program, amp.ptr, 2) )
        program[getSetPos(amp, program, amp.ptr, 3)] = (1 if getValue(amp, program, amp.ptr, 1) < getValue(amp, program, amp.ptr, 2) else 0)
        amp.ptr = amp.ptr+4
    elif cmd == 8:
        # debug_print('command', 'command8', amp.ptr, getValue(amp, program, amp.ptr, 1),' == ', getValue(amp, program, amp.ptr, 2), getValue(amp, program, amp.ptr, 1) == getValue(amp, program, amp.ptr, 2) )
        program[getSetPos(amp, program, amp.ptr, 3)] = (1 if getValue(amp, program, amp.ptr, 1) == getValue(amp, program, amp.ptr, 2) else 0)
        amp.ptr = amp.ptr+4
    elif cmd == 9:
        # debug_print('command', 'replative base: ', amp.relativeBase, ' to: ', getValue(amp, program, amp.ptr, 1))
        amp.relativeBase += getValue(amp, program, amp.ptr, 1)
        amp.ptr = amp.ptr+2
    elif cmd == 99:
        # debug_print('command', 'command99', amp.ptr)
        amp.halt = True
        # return OUTPUT[-1]
    else:
        # debug_print('error', 'wtf??', amp.ptr)
        # debug_print('error', amp.program[amp.ptr])
        # for i in range(0, len(amp.program)):
        #     debug_print('error', i, amp.program[i])

        raise Exception('WTF???!?!?!')


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
    # program = '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'.split(',')

    # program = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'.split(',')
    # program = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'.split(',')
    
    # program = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'.split(',')
    # program = '1102,34915192,34915192,7,4,7,99,0'.split(',')
    # program = '104,1125899906842624,99'.split(',')

    for i in range(0, 10000):
        if i < len(program):
            program[i] = int(program[i])
        else:
            program.append(0)
    return program

def get_new_pos(dir, pos):
    if dir == 1:
        return (pos[0], pos[1]-1)
    elif dir == 2:
        return (pos[0], pos[1]+1)
    elif dir == 3:
        return (pos[0]-1, pos[1])
    else:
        return (pos[0]+1, pos[1])



def dump(table, pos, N):
    for y in range(0, N):
        for x in range(0, N):
    # for y in range(pos[1] - 10, pos[1] + 10):
    #     for x in range(pos[0] - 10, pos[0] + 10):
    # for y in range(N//2 - 40, N//2 + 40):
    #     for x in range(N//2 - 40, N//2 + 40):
            if y == pos[1] and x == pos[0]:
                print('D', end='')
            # elif y == N//2 and x == N//2:
            #     print('S', end='')
            else:
                print(table[y][x], end='')
        print('')
    print('---------------------')

program = read_file()
program[0] = 2
amp = Amp(program, [], 0, 0)

N = 37
table = [[' ' for i in range(0, N)] for j in range(0, N)]
pos = (0,0)
last = None
try:
    while not amp.halt:
        # asd = '65,44,65,44,66,44,67,44,66,44,67,44,66,44,67,44,67,44,65,10,82,44,56,44,76,44,52,44,82,44,52,44,82,44,57,44,49,44,82,44,56,10,76,44,57,44,51,44,76,44,57,44,51,44,82,44,56,44,82,44,56,10,82,44,57,44,49,44,82,44,56,44,82,44,56,10'
        # asd = '65,44,65,44,66,44,66,44,66,44,67,44,65,10,82,44,56,44,76,44,52,44,82,44,52,44,82,44,49,48,44,82,44,56,10,76,44,49,50,44,76,44,49,50,44,82,44,56,44,82,44,56,44,82,44,49,48,44,82,44,52,44,82,44,52,10,82,44,49,48,44,82,44,52,44,82,44,52,10'
        asd = '65,44,65,44,66,44,67,44,66,44,67,44,66,44,67,44,67,44,65,10,82,44,56,44,76,44,52,44,82,44,52,44,82,44,49,48,44,82,44,56,10,76,44,49,50,44,76,44,49,50,44,82,44,56,44,82,44,56,10,82,44,49,48,44,82,44,52,44,82,44,52,10'
        for i in asd.split(','):
            amp.input.append(int(i))
        # amp.input.append(110) # n
        amp.input.append(121) # y
        amp.input.append(10)
        result = part1(amp)
        # if result == 35:
        #     table[pos[1]][pos[0]] = '#'
        #     pos = (pos[0] + 1, pos[1])
        # elif result == 46:
        #     table[pos[1]][pos[0]] = '.'
        #     pos = (pos[0] + 1, pos[1])
        # elif result == 94:
        #     table[pos[1]][pos[0]] = '^'
        #     pos = (pos[0] + 1, pos[1])
        if result in [35,46,94,60,62,118]:
            # table[pos[1]][pos[0]] = chr(result)
            print(chr(result), end='')
            # pos = (pos[0] + 1, pos[1])
        elif result == 10:
            # pos = (0, pos[1] + 1)
            if last == 10:
                # _ = input()
                _ = system('cls')
            else:
                print('')

        else:
            pos = (0,0)
            # print(result, pos)
            # print('???')
            print(chr(result), end='')
        last = result
            
            # _ = system('cls')
            # dump(table, pos, N)
            # _ = input()
except:
    print('Except')
    pass
print(OUTPUT[-1])

sum = 0
for y in range(1, N-1):
    for x in range(1, N-1):
        if table[y][x] == '#' and table[y-1][x] == '#'and table[y+1][x] == '#'and table[y][x-1] == '#'and table[y][x+1] == '#':
            sum += x*y
print(sum)


# 65,44,65,44,66,44,66,44,66,44,67,44,65,10,
# 82,44,56,44,76,44,52,44,82,44,52,44,82,44,49,48,44,82,44,56,10,
# 76,44,49,50,44,76,44,49,50,44,82,44,56,44,82,44,56,44,82,44,49,48,44,82,44,52,44,82,44,52,10,
# 82,44,49,48,44,82,44,52,44,82,44,52,10



# R,8,L,4,R,4,R,10,R,8,R,8,L,4,R,4,R,10,R,8,L,12,L,12,R,8,R,8,R,10,R,4,R,4,L,12,L,12,R,8,R,8,R,10,R,4,R,4,L,12,L,12,R,8,R,8,R,10,R,4,R,4,R,10,R,4,R,4,R,8,L,4,R,4,R,10,R,8

# A: R,8,L,4,R,4,R,10,R,8
# B: L,12,L,12,R,8,R,8,R,10,R,4,R,4
# C: R,10,R,4,R,4
# A,A,B,B,B,C,C,A
# Main: 65,44,65,44,66,44,66,44,66,44,67,44,67,44,65,10
#    A: 82,44,56,44,76,44,52,44,82,44,52,44,82,44,49,48,44,82,44,56,10
#    B: 76,44,49,50,44,76,44,49,50,44,82,44,56,44,82,44,56,44,82,44,49,48,44,82,44,52,44,82,44,52,10
#    C: 82,44,49,48,44,82,44,56,44,82,44,56,10

# 65,44,65,44,66,44,66,44,66,44,67,44,67,44,65,10,82,44,56,44,76,44,52,44,82,44,52,44,82,44,49,48,44,82,44,56,10,76,44,49,50,44,76,44,49,50,44,82,44,56,44,82,44,56,44,82,44,49,48,44,82,44,52,44,82,44,52,44,10,82,44,49,48,44,82,44,56,44,82,44,56,44,10
# R = 82
# L = 76

# 0 = 48
# 1 = 49
# 2 = 50
# 3 = 51
# 4 = 52
# 5 = 53
# 6 = 54
# 7 = 55
# 8 = 56
# 9 = 57

# A = 65
# B = 66
# C = 67


# A: R,8,L,4,R,4,R,10,R,8
# B: L,12,L,12,R,8,R,8
# C: R,10,R,4,R,4
# A,A,B,C,B,C,B,C,C,A
# Main: 65,44,65,44,66,44,67,44,66,44,67,44,66,44,67,44,67,44,65,10
#    A: 82,44,56,44,76,44,52,44,82,44,52,44,82,44,57,44,49,44,82,44,56,10
#    B: 76,44,57,44,51,44,76,44,57,44,51,44,82,44,56,44,82,44,56,44,10
#    C: 82,44,57,44,49,44,82,44,56,44,82,44,56,44,10

##### 65,44,65,44,66,44,67,44,66,44,67,44,66,44,67,44,67,44,65,10,82,44,56,44,76,44,52,44,82,44,52,44,82,44,49,48,44,82,44,56,10,76,44,49,50,44,76,44,49,50,44,82,44,56,44,82,44,56,44,10,82,44,49,48,44,82,44,56,44,82,44,56,44,10
# 65,44,65,44,66,44,67,44,66,44,67,44,66,44,67,44,67,44,65,10,82,44,56,44,76,44,52,44,82,44,52,44,82,44,57,44,49,44,82,44,56,10,76,44,57,44,51,44,76,44,57,44,51,44,82,44,56,44,82,44,56,44,10,82,44,57,44,49,44,82,44,56,44,82,44,56,44,10



s = 'R,8,L,4,R,4,R,10,R,8,R,8,L,4,R,4,R,10,R,8,L,12,L,12,R,8,R,8,R,10,R,4,R,4,L,12,L,12,R,8,R,8,R,10,R,4,R,4,L,12,L,12,R,8,R,8,R,10,R,4,R,4,R,10,R,4,R,4,R,8,L,4,R,4,R,10,R,8'.split(',')
original = map(''.join, zip(s[::2], s[1::2]))
print(original)


def compress(original, s, d, n):
    # print(n, s)
    if n == 3:
        aaa = True
        for i in s:
            if i != ' ':
                aaa = False
                break
        if aaa:
            dd = dict()
            for i in d:
                tmp = []
                asd = d[i].split(',')
                for j in asd:
                    if j == '': continue
                    try:
                        n = int(j)
                        # a = n // 10
                        # for k in range(0,a):
                        #     tmp.append(ord('9'))
                        if n >= 10:
                            # tmp.append(ord('9'))
                            # tmp.append(ord('0')+(n-9))
                            tmp.append(ord('1'))
                            tmp.append(ord('0')+(n-10))
                        else:
                            tmp.append(ord(j))
                    except Exception as e:
                        # print(e)
                        # print(j)
                        tmp.append(ord(j))
                    tmp.append(44)
                if len(tmp) > 22:
                # if len(tmp) > 11:
                    return
                dd[i] = tmp

            
            print(original)
            for i in dd:
                print(i, ",".join(str(x) for x in dd[i][:-1]) + ',10,')
            print('')
            print(",44,".join(str(ord(i)) for i in original),end=',10,')
            for i in dd:
                print(",".join(str(x) for x in dd[i][:-1]) + ',10,', end='')


            # print(d)
            print('\n-----------------')
        return
    i = 0
    # print(n, s)
    k = 0
    while k < len(s) and s[k] == ' ':
        k += 1
    i = k
    while i < len(s):
        j = i+2
        while j < len(s) and s[j] != ',':
            if s[j] == ' ': return
            j+=1
        pattern = s[k:j+1]
        new_s = s.replace(pattern, ' '*len(pattern))
        # print(n, pattern)
        # print(new_s)
        # _ = input()
        # print('_---------------')
        d[n] = pattern
        compress(original.replace(pattern, chr(ord('A') + n)), new_s, d, n+1)
        del d[n]
        i = j+1

s = 'R,8,L,4,R,4,R,10,R,8,R,8,L,4,R,4,R,10,R,8,L,12,L,12,R,8,R,8,R,10,R,4,R,4,L,12,L,12,R,8,R,8,R,10,R,4,R,4,L,12,L,12,R,8,R,8,R,10,R,4,R,4,R,10,R,4,R,4,R,8,L,4,R,4,R,10,R,8,'
compress(s, s, dict(), 0)
