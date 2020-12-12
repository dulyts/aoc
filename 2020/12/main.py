import math

def read_file(file):
    data = []
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        for line in lines:
            new_data = {
                "action": line[:1],
                "value": int(line[1:])
            }
            data.append(new_data)
    return data

def move(dir, value):
    if dir ==  "N":
        return (0, value)
    if dir ==  "S":
        return (0, -value)
    if dir ==  "E":
        return (value, 0)
    if dir ==  "W":
        return (-value, 0)

def rotate(curr, dir, value):
    dirs = ["N", "E", "S", "W"]
    i = dirs.index(curr)
    n = value / 90
    a = -1 if dir == "L" else 1
    j = int((i + a*n) % 4)
    return dirs[j]

def part1(data):
    current_dir = "E"
    x = 0
    y = 0
    for d in data:
        # print(x, y)
        if d["action"] == "F":
            m = move(current_dir, d["value"])
            x += m[0]
            y += m[1]
            continue
        if d["action"] in ["N", "S", "E", "W"]:
            m = move(d["action"], d["value"])
            x += m[0]
            y += m[1]
            continue
        if d["action"] in ["L", "R"]:
            current_dir = rotate(current_dir, d["action"], d["value"])
            continue
    print(abs(x), abs(y))
    print(abs(x) + abs(y))


#10,4 -> 4 10

def rotate_2(w_x, w_y, dir, value, o_x, o_y):
    a = 1 if dir == "L" else -1
    alpha = math.radians(a*value)
    o_x=0
    o_y=0
    new_x = round(math.cos(alpha) * (w_x-o_x) - math.sin(alpha) * (w_y-o_y) + o_x)
    new_y = round(math.sin(alpha) * (w_x-o_x) + math.cos(alpha) * (w_y-o_y) + o_y)
    return (new_x, new_y)

def part2(data):
    x = 0
    y = 0
    w_x = 10
    w_y = 1
    for d in data:
        if d["action"] == "F":
            x += w_x * d["value"]
            y += w_y * d["value"]
            continue
        if d["action"] in ["N", "S", "E", "W"]:
            m = move(d["action"], d["value"])
            w_x += m[0]
            w_y += m[1]
            continue
        if d["action"] in ["L", "R"]:
            new_coorsd = rotate_2(w_x, w_y, d["action"], d["value"], x, y)
            w_x = new_coorsd[0]
            w_y = new_coorsd[1]
            continue
    
    print(abs(x), abs(y))
    print(abs(x) + abs(y))

filename = "input.txt"
filename = "sample_0.txt"

data = read_file(filename)
# print(data)
part1(data)
part2(data)