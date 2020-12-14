from itertools import product

def read_file(file):
    data = []
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        new_data={
            "mems": []
        }
        for i in range(0, len(lines)):
            line = lines[i].split(" = ")
            if line[0] == "mask":
                if i > 0:
                    data.append(new_data)
                new_data = {
                    "mask": line[1],
                    "mems": []
                }
                continue

            addr = line[0][4:-1]
            new_data["mems"].append({
                "addr": int(addr),
                "val": "{0:b}".format(int(line[1])).zfill(36)
            })
    
    data.append(new_data)
    return data

def apply_mask(current, value, mask): 
    result = [i for i in current]
    for i in range(0,36):
        if mask[i] == "X":
            result[i] = value[i]
        else: 
            result[i] = mask[i]
    return result

def part1(data):
    memory = {}
    for m in data:
        for w in m["mems"]:
            if w["addr"] not in memory:
                memory[w["addr"]] = ["0" for i in range(0, 36)]
            memory[w["addr"]] = apply_mask(memory[w["addr"]], w["val"], m["mask"])

    mem_sum = 0
    for k in memory:
        mem_sum += int("".join(memory[k]), 2)
    print(mem_sum)


def mem_mask(addr, mask): 
    result = list("{0:b}".format(addr).zfill(36))
    for i in range(0,36):
        if mask[i] == "X":
            result[i] = "X"
        if mask[i] == "1":
            result[i] = "1"
    return result

def part2(data):
    memory = {}
    for m in data:
        for w in m["mems"]:
            mask = mem_mask(w["addr"], m["mask"])
            floating = mask.count("X")
            for i in product(range(2), repeat=floating):
                clone = [j for j in mask]
                c = 0
                for j in range(0, 36):
                    if clone[j] == "X":
                        clone[j] = str(i[c])
                        c += 1
                addr = int("".join(clone), 2)
                memory[addr] = w["val"]
    
    mem_sum = 0
    for k in memory:
        mem_sum += int("".join(memory[k]), 2)
    print(mem_sum)


filename = "input.txt"
# filename = "sample_0.txt"
# filename = "sample_1.txt"

data = read_file(filename)
# print(data)
part1(data)
part2(data)
