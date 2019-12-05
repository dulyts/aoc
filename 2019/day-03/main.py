import numpy as np

N = 20000

def get_intersect(a1, a2, b1, b2):
    """ 
    Returns the point of intersection of the lines passing through a2,a1 and b2,b1.
    a1: [x, y] a point on the first line
    a2: [x, y] another point on the first line
    b1: [x, y] a point on the second line
    b2: [x, y] another point on the second line
    """
    s = np.vstack([a1,a2,b1,b2])        # s for stacked
    h = np.hstack((s, np.ones((4, 1)))) # h for homogeneous
    l1 = np.cross(h[0], h[1])           # get first line
    l2 = np.cross(h[2], h[3])           # get second line
    x, y, z = np.cross(l1, l2)          # point of intersection
    if z == 0:                          # lines are parallel
        # return (float('inf'), float('inf'))
       raise Exception('lines do not intersect')
    
    crossX = x/z
    crossY = y/z

    # print('crossX < min(a1[0], a2[0])', crossX < min(a1[0], a2[0]))
    # print('crossX > max(a1[0], a2[0])', crossX > max(a1[0], a2[0]))
    # print('crossX < min(b1[0], b2[0])', crossX < min(b1[0], b2[0]))
    # print('crossX > max(b1[0], b2[0])', crossX > max(b1[0], b2[0]))
    # print('crossY < min(a1[1], a2[1])', crossY < min(a1[1], a2[1]))
    # print('crossY > max(a1[1], a2[1])', crossY > max(a1[1], a2[1]))
    # print('crossY < min(b1[1], b2[1])', crossY < min(b1[1], b2[1]))
    # print('crossY > max(b1[1], b2[1])', crossY > max(b1[1], b2[1]))

    if crossX < min(a1[0], a2[0]) or crossX > max(a1[0], a2[0]) or crossX < min(b1[0], b2[0]) or crossX > max(b1[0], b2[0]) or crossY < min(a1[1], a2[1]) or crossY > max(a1[1], a2[1]) or crossY < min(b1[1], b2[1]) or crossY > max(b1[1], b2[1]):
        raise Exception('asd')

    return (x/z, y/z)


def process_command(inpu, wires, from_point):
    dir = inpu[:1]
    step = int(inpu[1:])
    if dir == 'R':
        x = from_point[0]
        y = from_point[1]
        end_y = from_point[1] + step
        wires.append(((x,y),(x,end_y)))
        return (x, end_y)

    elif dir == 'U':
        x = from_point[0]
        end_x = from_point[0] - step
        y = from_point[1]
        wires.append(((x,y),(end_x,y)))
        return (end_x, y)

    elif dir == 'L':
        x = from_point[0]
        y = from_point[1]
        end_y = from_point[1] - step
        wires.append(((x,y),(x,end_y)))
        return (x, end_y)

    elif dir == 'D':
        x = from_point[0]
        end_x = from_point[0] + step
        y = from_point[1]
        wires.append(((x,y),(end_x,y)))
        return (end_x, y)

def part1(inputs, wires, starting_point):
    min = 1000000
    minPath = 1000000
    crosses = []
    # inputs = ['R75,D30,R83,U83,L12,D49,R71,U7,L72','U62,R66,U55,R34,D71,R55,D58,R83']
    # inputs = ['R8,U5,L5,D3','U7,R6,D4,L4']
    for i in range(0, len(inputs)):
        current_point = starting_point
        for input in inputs[i].split(','):
            current_point = process_command(input, wires[i], current_point)
    for wires1 in range(0, len(wires)):
        for wires2 in range(wires1+1, len(wires)):
            wire1Len = 0
            for wire1 in wires[wires1]:
                wire2Len = 0
                for wire2 in wires[wires2]:
                    try:
                        (crossPointX, crossPointY) = get_intersect(wire1[0], wire1[1], wire2[0], wire2[1])
                        crossDist = abs(starting_point[0] - crossPointX) + abs(starting_point[1] - crossPointY)
                        if crossDist != 0:
                            pp = wire1Len + abs(wire1[0][0] - crossPointX) + abs(wire1[0][1] - crossPointY) + wire2Len + abs(wire2[0][0] - crossPointX) + abs(wire2[0][1] - crossPointY)
                            if minPath > pp:
                                minPath = pp
                            if min > crossDist:
                                min = crossDist
                        
                        wire2Len += abs(wire2[0][0] - wire2[1][0]) + abs(wire2[0][1] - wire2[1][1])
                    except:
                        wire2Len += abs(wire2[0][0] - wire2[1][0]) + abs(wire2[0][1] - wire2[1][1])
                wire1Len += abs(wire1[0][0] - wire1[1][0]) + abs(wire1[0][1] - wire1[1][1])

    
    
    print('result')
    print(min)
    print(minPath)


with open("input.txt") as f:
    lines = [line[:-1] for line in f]
    wires = [[],[]]
    starting_point = (8,1)
    part1(lines, wires, starting_point)
