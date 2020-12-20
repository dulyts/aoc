import re

def read_file(filename):
    data = {
        "messages": []
    }
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        data["rules"] = [[] for i in lines]
        i = 0
        while lines[i] != "":
            r = lines[i].split(": ")
            if r[1].startswith("\""):
                data["rules"][int(r[0])] = r[1][1]
            else:
                rule_groups = r[1].split(" | ")
                for group in rule_groups:
                    a = [int(i) for i in group.split(" ")]
                    data["rules"][int(r[0])].append(a)
            i += 1
        i += 1
        while i < len(lines):
            data["messages"].append(lines[i])
            i += 1
    return data

def part1(data):
    regex = " ".join([str(i) for i in data["rules"][0][0]])
    changed = True
    while changed:
        changed = False
        new_regex = ""
        for i in regex.split(" "):
            if i.isnumeric():
                # print(data["rules"][int(i)])
                tmp = []
                for j in data["rules"][int(i)]:
                    tmp.append(" ".join([str(k) for k in j]))

                # print(" ".join([str(j) for j in data["rules"][int(i)][0]]))
                # print(" | ".join(" ".join([str(j) for j in data["rules"][int(i)][0]])))
                # new_regex += " ( " + " | ".join(" ".join([str(j) for j in data["rules"][int(i)][0]])) + " ) "
                if len(tmp) == 1:
                    new_regex += " " + tmp[0] + " "
                else:
                    new_regex += " ( " + " | ".join(tmp) + " ) "
                # print(new_regex)
                changed = True
            else:
                new_regex += " " + i + " "
        regex = new_regex
    print(regex.replace(" ", ""))

    c = 0
    for msg in data["messages"]:
        result = re.match("^"+regex.replace(" ", "")+"$", msg)
        if result:
            c += 1
    print(c)

def part2(data):
    regex = " ".join([str(i) for i in data["rules"][0][0]])
    changed = True
    m = 100
    while changed and m > 0:
        print(m)
        changed = False
        new_regex = ""
        for i in regex.split(" "):
            if i.isnumeric():
                # print(data["rules"][int(i)])
                tmp = []
                for j in data["rules"][int(i)]:
                    tmp.append(" ".join([str(k) for k in j]))

                # print(" ".join([str(j) for j in data["rules"][int(i)][0]]))
                # print(" | ".join(" ".join([str(j) for j in data["rules"][int(i)][0]])))
                # new_regex += " ( " + " | ".join(" ".join([str(j) for j in data["rules"][int(i)][0]])) + " ) "
                if len(tmp) == 1:
                    new_regex += " " + tmp[0] + " "
                else:
                    new_regex += " ( " + " | ".join(tmp) + " ) "
                # print(new_regex)
                changed = True
            else:
                new_regex += " " + i + " "

        regex = new_regex.replace("  ", " ")
        m -= 1
    # print(regex.replace(" ", ""))

    c = 0
    for msg in data["messages"]:
        result = re.match("^"+regex.replace(" ", "")+"$", msg)
        if result:
            c += 1
    print(c)

filename = "input.txt"
# filename = "sample_0.txt"
# filename = "sample_1.txt"

data = read_file(filename)
# print(data)
part1(data)

filename_2 = "input_2.txt"
# filename_2 = "sample_2.txt"

data2 = read_file(filename_2)
# print(data2)
part2(data2)