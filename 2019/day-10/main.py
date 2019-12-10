import numpy as np
import math
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


def distance(a,b):
    return math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

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
    return asteroids

def process_asteroids(asteroids, origo):
    byAngles = dict()

    for i in asteroids:
        myradian = math.atan2(i[0]-origo[0], i[1]-origo[1])
        mydegree = 360 - (math.degrees(myradian) - 180)
        if mydegree not in byAngles:
            byAngles[mydegree] = []
        byAngles[mydegree].append((i, distance(origo, i)))
    
    sortedKeys = sorted(byAngles)
    orderedAngles = []
    for i in sortedKeys:
        orderedAngles.append(sorted(byAngles[i], key=lambda x: x[1]))
    return orderedAngles

@timeit
def part1(filename):
    asteroids = read_file(filename)
    
    max_visible_ast = 0
    max_visible_pos = None
    max_visible_asts = None
    for i in asteroids:
        orderedAngles = process_asteroids(asteroids, i)
        if len(orderedAngles) > max_visible_ast:
            max_visible_ast = len(orderedAngles)
            max_visible_pos = i
            max_visible_asts = orderedAngles
    print('--> part1 result:', max_visible_ast)
    print(max_visible_pos)
    return (max_visible_pos, max_visible_asts)



@timeit
def part2(p1_result):
    orderedAngles = p1_result[1]
    vaporisedAst = []
    while len(vaporisedAst) < 200:
        for i in orderedAngles:
            if len(i) > 0:
                vaporisedAst.append(i.pop(0)[0])
    result = vaporisedAst[199]
    print('--> part2 result:', result[0]*100 + result[1])

@timeit
def main():
    filename = 'input.txt'
    # filename = 'test5.txt'
    p1_result = part1(filename)
    # (31, 20)
    # 319
    part2(p1_result)
    # (5, 17)

main()