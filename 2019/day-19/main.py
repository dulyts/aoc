from itertools import permutations
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
        self.original_program = [i for i in program]
        self.program = program
        self.halt = False
        self.ptr = 0
        self.input = inp
        self.relativeBase = relativeBase

    def reset(self):
        self.program = [i for i in self.original_program]
        self.halt = False
        self.ptr = 0
        self.relativeBase = 0
    
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
        debug_print('error', 'wtf??', amp.ptr)
        debug_print('error', amp.program[amp.ptr])
        # for i in range(0, len(amp.program)):
        #     debug_print('error', i, amp.program[i])

        raise Exception('WTF???!?!?!')


def read_file():
    with open("input.txt") as f:
    # with open("input_2.txt") as f:
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



program = read_file()
N = 50
sum = 0

amp = Amp(program, [], 0, 0)
for y in range(0, N):
    for x in range(0, N):
        amp.reset()
        amp.input.append(x)
        amp.input.append(y)
        while not amp.halt:
            result = part1(amp)
            if result:
                sum += result

print(sum)


def check(amp, pos_x, pos_y):
    amp.reset()
    amp.input.append(pos_x)
    amp.input.append(pos_y)
    return part1(amp) == 1


bl_x, bl_y = (0,100)
# bl_x, bl_y = (0,100)
not_found = True
while not_found:
    good_bl = check(amp, bl_x, bl_y)
    while not good_bl:
        bl_x += 1
        good_bl = check(amp, bl_x, bl_y)
    if not check(amp, bl_x, bl_y-99):
        bl_y += 1
    else:
        if check(amp, bl_x+99, bl_y-99):
            not_found = False
        else:
            bl_y += 1

print(bl_x, bl_y-99)
print(bl_x * 10000 + (bl_y-99))






# # amp = Amp(program, [0,0,1,0], 0, 0)
# # amp = Amp(program, [1,0], 0, 0)
# # amp = Amp(program, [1,1], 0, 0)
# amp = Amp(program, [40, 25], 0, 0)
# while not amp.halt:
#     result = part1(amp)

#     # print(amp, amp.halt, result, OUTPUT[-1])
#     print(result)
#     # print(OUTPUT[-1])
# print(OUTPUT)

# max_sum = 0
# max_solution = None
# for perm in list(permutations('56789', 5)):
# # for perm in list(permutations('01234', 5)):
# # for perm in [(9,8,7,6,5)]:
# # for perm in [(9,7,8,5,6)]:
#     amps = []
#     last_output = 0
#     ampId = 0
#     for ampInput in perm:
#         program = read_file()
#         amp = Amp(program, [ampInput], ampId, 0)
#         amps.append(amp)
#         ampId += 1
    
#     asd = True
#     i = 0
#     while asd:
#     # for ampInput in perm:
#         amp = amps[i%5]
#         amp.input.append(last_output)
#         result = part1(amp)
#         print(amp, i%5, amp.halt, result, OUTPUT[-1])
#         # if result:
#         #     last_output = result
#         last_output = OUTPUT[-1]
        
#         asd = not (i%5 == 4 and amp.halt)
#         # print(result[0])
#         # print('OUTPUT:', OUTPUT[-1])
#         # print('OUTPUT:', OUTPUT)
#         # last_output = OUTPUT[-1]
#         # print('last_output', last_output)
#         i += 1
        

#     if last_output > max_sum:
#         max_sum = last_output
#         max_solution = perm

# print(max_sum, max_solution)


