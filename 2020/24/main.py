def read_file(filename):
    data = []
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        for l in lines:
            d = []
            i = 0
            while i < len(l):
                if l[i] in ["e", "w"]:
                    d.append(l[i])
                    i += 1
                else:
                    d.append("".join(l[i:i+2]))
                    i+=2
            data.append(d)
    return data

# e, se, sw, w, nw, and ne
def part1(data):
    flipped = []

    for d in data:
        curr = (0,0)
        for i in d:
            if i == "e":
                curr = (curr[0]+1, curr[1])
            if i == "se":
                curr = (curr[0]+1, curr[1]-1)
            if i == "sw":
                curr = (curr[0], curr[1]-1)
            if i == "w":
                curr = (curr[0]-1, curr[1])
            if i == "nw":
                curr = (curr[0]-1, curr[1]+1)
            if i == "ne":
                curr = (curr[0], curr[1]+1)

        if curr in flipped:
            flipped.remove(curr)
        else:
            flipped.append(curr)
    print(len(flipped))

    for i in range(0,100):
        tmp = []
        blacks = {}
        whites = {}
        for j in flipped:
            blacks[str(j[0]) + "#" + str(j[1])] = count_neigbours(flipped, j[0], j[1])
            w = get_white_neigbours(flipped, j[0], j[1])
            for k in w:
                w_key = str(k[0]) + "#" + str(k[1])
                if w_key not in whites:
                    whites[w_key] = 0
                whites[w_key] += 1
        for j in blacks.keys():
            if blacks[j] > 0 and blacks[j] <= 2:
                t = j.split("#")
                tmp.append((int(t[0]), int(t[1])))
        for j in whites.keys():
            if whites[j] == 2:
                t = j.split("#")
                tmp.append((int(t[0]), int(t[1])))
        print(i+1, len(tmp))
        flipped = tmp



def count_neigbours(flipped, x, y):
    c = 0
    if (x-1, y) in flipped: c += 1
    if (x+1, y) in flipped: c += 1
    if (x-1, y+1) in flipped: c += 1
    if (x, y+1) in flipped: c += 1
    if (x, y-1) in flipped: c += 1
    if (x+1, y-1) in flipped: c += 1
    return c

def get_white_neigbours(flipped, x, y):
    tmp = []
    if (x-1, y) not in flipped: tmp.append((x-1, y))
    if (x+1, y) not in flipped: tmp.append((x+1, y))
    if (x-1, y+1) not in flipped: tmp.append((x-1, y+1))
    if (x, y+1) not in flipped: tmp.append((x, y+1))
    if (x, y-1) not in flipped: tmp.append((x, y-1))
    if (x+1, y-1) not in flipped: tmp.append((x+1, y-1))
    return tmp


def part2(data):
    pass

filename = "input.txt"
# filename = "sample_0.txt"

data = read_file(filename)
# print(data)
part1(data)
part2(data)