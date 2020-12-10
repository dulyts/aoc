def read_file(file):
    with open(filename) as file:
        # lines = [line[:-1] for line in file].sort()
        lines = [int(line[:-1]) for line in file]
        lines.sort()
        return lines

def part1(data):
    diff_1s = 0
    diff_3s = 0
    last = 0
    for i in data:
        diff = i-last
        if diff > 3:
            break
        if diff == 1:
            diff_1s += 1
        if diff == 3:
            diff_3s += 1
        last = i
    diff_3s += 1
    print(diff_1s * diff_3s)
    return last
    
        
def count_node_p(data, node_i, count):
    if count[node_i] != -1:
        return count[node_i]
    
    j = node_i + 1
    c = 0
    while j < len(data) and data[j] <= data[node_i] + 3:
        c += count_node_p(data, j, count)
        j += 1
    count[node_i] = c
    if c == 0:
        return 1
    return c


def part2(data):
    count = [-1 for i in range(0, len(data))]
    count_node_p(data, 0, count)
    
    return count[0]

        


filename = "input.txt"
# filename = "sample_0.txt"
# filename = "sample_1.txt"

data = read_file(filename)
last = part1(data)
data.append(last)
data.insert(0, 0)
print(part2(data))