def read_file(filename):
    data = {
        "p1":[],
        "p2":[]
    }
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        i = 1
        while lines[i] != "":
            data["p1"].append(int(lines[i]))
            i+=1
        i += 2
        while i < len(lines):
            data["p2"].append(int(lines[i]))
            i+=1
    return data

def move_card(d1, d2):
    d1.append(d1.pop(0))
    d1.append(d2.pop(0))

def part1(data):
    while len(data["p1"]) > 0 and len(data["p2"]) > 0:
        if data["p1"][0] > data["p2"][0]:
            move_card(data["p1"], data["p2"])
        else:
            move_card(data["p2"], data["p1"])

    winner = data["p1"] if len(data["p1"]) > 0 else data["p2"]
    point = 0
    for i in range(0, len(winner)):
        point += winner[i] * (len(winner) - i)
    print(point)


def part2(data):
    prev = []
    while len(data["p1"]) > 0 and len(data["p2"]) > 0:
        if ",".join([str(x) for x in data["p1"]])+"-"+",".join([str(x) for x in data["p2"]]) in prev:
            return (True, [])
        prev.append(",".join([str(x) for x in data["p1"]]) + "-" + ",".join([str(x) for x in data["p2"]]))
        p1_win = None
        if data["p1"][0] <= len(data["p1"])-1 and data["p2"][0] <= len(data["p2"])-1:
            p1_win, _ = part2({"p1": [x for x in data["p1"][1:(1+data["p1"][0])]], "p2": [x for x in data["p2"][1:(1+data["p2"][0])]] })
        else:
            p1_win = data["p1"][0] > data["p2"][0]

        if p1_win == True:
            move_card(data["p1"], data["p2"])
        else:
            move_card(data["p2"], data["p1"])
    return (True, data["p1"]) if len(data["p1"]) > 0 else (False, data["p2"])


filename = "input.txt"
# filename = "sample_0.txt"
# filename = "sample_1.txt"

data = read_file(filename)
# print(data)
part1(data)
data = read_file(filename)
_, winner = part2(data)

point = 0
for i in range(0, len(winner)):
    point += winner[i] * (len(winner) - i)
print(point)