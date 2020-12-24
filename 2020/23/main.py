
def part1(data):
    N = len(data)
    mi = min(data)
    ma = max(data)
    for i in range(0, 100):
        curr = data[i % N]
        picks = []
        tt = 0
        s = False
        j = (i % N)+1
        while len(picks) < 3:
            if s:
                tt += 1
            if j >= len(data):
                j = 0
                s = True
            picks.append(data[j])
            del data[j]

        
        dest = curr-1
        if dest < mi:
            dest = ma
        while dest in picks:
            dest -= 1
            if dest < mi:
                dest = ma
        j = data.index(dest)
        # print("--->", picks, data, dest, i, j)
        data = data[:j+1] + picks + data[j+1:]
        while data[i%N] != curr:
            data = data[1:] + data[:1]
    print(data)
    j = data.index(1)+1
    result = ""
    for i in range(0, N-1):
        result += str(data[(j+i) % N])
    print(result)

class Node:
    def __init__(self, dataval=None):
        self.dataval = dataval
        self.nextval = None

def part2(data):
    curr = None
    prev = None
    node_map = {}
    ma = max(data) + 1
    while len(data) < 1000000:
        data.append(ma)
        ma += 1
    ma = max(data)
    mi = min(data)
    for i in data:
        if i > ma:
            ma = i
        n = Node(i)
        node_map[i] = n
        if curr is None:
            curr = n
        if prev is not None:
            prev.nextval = n
        prev = n
    prev.nextval = curr

    for i in range(0, 10000000):
        picks = []
        picks_val = []
        for i in range(0,3):
            n = unlink_next(curr)
            picks.append(n)
            picks_val.append(n.dataval)
    
        dest = curr.dataval - 1
        if dest < mi:
            dest = ma
        while dest in picks_val:
            dest -= 1
            if dest < mi:
                dest = ma
        
        dest_node = node_map[dest]
        # while len(picks) > 0:
            # add_next(dest_node, picks.pop())
        add_next(dest_node, picks.pop())
        add_next(dest_node, picks.pop())
        add_next(dest_node, picks.pop())

        curr = curr.nextval
    
    print(node_map[mi].nextval.dataval, node_map[mi].nextval.nextval.dataval)
    print(node_map[mi].nextval.dataval * node_map[mi].nextval.nextval.dataval)
    

def add_next(node, next_node):
    next_node.nextval = node.nextval
    node.nextval = next_node

def unlink_next(node):
    tmp = node.nextval
    node.nextval = tmp.nextval
    tmp.nextval = None
    return tmp



data = "487912365" # input
# data = "389125467" # sample

parsed_data = [int(c) for c in data]
part1(parsed_data)

parsed_data = [int(c) for c in data]
part2(parsed_data)