import numpy as np
import math
import time
from datetime import datetime
import bisect

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


def distance(a,b):
    return math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

def is_between(a,c,b):
    # return abs(distance(a,c) + distance(c,b) - distance(a,b)) < 0.0001
    # return abs(distance(a,c) + distance(c,b) - distance(a,b)) < 0.000001
    # return abs(distance(a,c) + distance(c,b) - distance(a,b)) < 0.001
    return abs(distance(a,c) + distance(c,b) - distance(a,b)) < 0.000000000001







def read_file(filename):
    asteroids = []
    with open(filename) as f:
        y = 0
        for line in f:
            x = 0
            for col in line:
                if col == "#":
                    asteroids.append((x,y))
                x += 1
            y += 1
        # print(asteroids)
    return asteroids

def process_asteroids(asteroids, origo):
    byAngles = dict()

    for i in asteroids:
        myradian = math.atan2(i[0]-origo[0], i[1]-origo[1])
        mydegree = 360 - (math.degrees(myradian) - 180)
        if mydegree not in byAngles:
            byAngles[mydegree] = []
        byAngles[mydegree].append((i, distance(origo, i)))
    
    # print(byAngles)
    sortedKeys = sorted(byAngles)
    orderedAngles = []
    for i in sortedKeys:
        orderedAngles.append(sorted(byAngles[i], key=lambda x: x[1]))
    return orderedAngles


def part1():
    asteroids = read_file("input.txt")
    # asteroids = read_file("test1.txt")
    # asteroids = read_file("test2.txt")
    # asteroids = read_file("test3.txt")
    # asteroids = read_file("test4.txt")
    # asteroids = read_file("test5.txt")
    # print(asteroids)
    max_pos = None
    max_ast = 0
    for i in range(0, len(asteroids)):
        count = 0
        # print(asteroids[i])
        for j in range(0, len(asteroids)):
            if i == j:
                continue
            asteroid_between = 0
            for other in range(0, len(asteroids)):
                if other == i or other == j:
                    continue
                if (is_between(asteroids[i], asteroids[other], asteroids[j])):
                    asteroid_between += 1
                    break
            # print('asteroid_between: ', asteroids[i], asteroids[other], asteroids[j], asteroid_between)
            if asteroid_between == 0:
                # print('canSee', asteroids[j])
                count += 1
        # print(asteroids[i])
        # print(count)
        # print('-----------')
        if count > max_ast:
            max_ast = count
            max_pos = asteroids[i]
    print(max_pos)
    print(max_ast)
    return max_pos

@timeit
def part1_1():
    asteroids = read_file("input.txt")
    # asteroids = read_file("test1.txt")
    # asteroids = read_file("test2.txt")
    # asteroids = read_file("test3.txt")
    # asteroids = read_file("test4.txt")
    # asteroids = read_file("test5.txt")
    
    max_visible_ast = 0
    max_visible_pos = None
    max_visible_asts = None
    for i in asteroids:
        orderedAngles = process_asteroids(asteroids, i)
        if len(orderedAngles) > max_visible_ast:
            max_visible_ast = len(orderedAngles)
            max_visible_pos = i
            max_visible_asts = orderedAngles
    print(max_visible_ast)
    print(max_visible_pos)
    return (max_visible_pos, max_visible_asts)



@timeit
def part2(p1_result):
    asteroids = read_file("input.txt")
    # asteroids = read_file("test5.txt")
    # origo = (11,13)
    # orderedAngles = process_asteroids(asteroids, origo)
    orderedAngles = p1_result[1]

    # print(orderedAngles)
    vaporisedAst = []
    while len(vaporisedAst) < 200:
        for i in orderedAngles:
            if len(i) > 0:
                vaporisedAst.append(i.pop(0)[0])
    
    # print(vaporisedAst)
    print(vaporisedAst[199])



# p1 = part1()
p1_result = part1_1()
# (31, 20)
# 319
part2(p1_result)
# (5, 17)