def read_file(file):
    data = {
        "rules": [],
        "all_rules": [],
        "ticket": [],
        "other": [],
    }
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        i = 0
        while lines[i] != "":
            l = lines[i].split(": ")
            rule = {
                "name": l[0],
                "rules": []
            }
            v = l[1].split(" or ")
            for j in v:
                vv = j.split("-")
                rule["rules"].append((int(vv[0]), int(vv[1])))
                data["all_rules"].append((int(vv[0]), int(vv[1])))
            data["rules"].append(rule)
            i += 1
        i+=2
        data["ticket"] = [int(j) for j in lines[i].split(",")]
        i+=3
        while i < len(lines):
            data["other"].append([int(j) for j in lines[i].split(",")])
            i+=1

    return data

def is_possible_valid(value, rules):
    i = 0
    while i < len(rules) and (value < rules[i][0] or value > rules[i][1]):
        i += 1
    return i < len(rules)

def is_valid(value, rules):
    i = 0
    while i < len(rules) and (value < rules[i][0] or value > rules[i][1]):
        i += 1
    return i < len(rules)


def part1(data):
    invalid_values = []
    valid_tickets = []
    for t in data["other"]:
        valid = True
        for v in t:
            if not is_possible_valid(v, data["all_rules"]):
                invalid_values.append(v)
                valid = False
        if valid:
            valid_tickets.append(t)
    print(sum(invalid_values))
    data["valids"] = valid_tickets

def part2(data):
    for rule in data["rules"]:
        validity = [is_valid(data["ticket"][i], rule["rules"]) for i in range(0, len(data["ticket"]))]
        
        for i in data["valids"]:
            for j in range(0, len(data["ticket"])):
                asd = is_valid(i[j], rule["rules"])
                validity[j] = validity[j] and asd
        rule["validity"] = validity


    hasChange = True
    processed = []
    while hasChange:
        hasChange = False
        for i in range(0, len(data["rules"])):
            if "processed" in data["rules"][i] and data["rules"][i]["processed"] == True:
                continue
            if data["rules"][i]["validity"].count(True) == 1:
                idx = data["rules"][i]["validity"].index(True)
                for j in range(0, len(data["rules"])):
                    if i != j:
                        data["rules"][j]["validity"][idx] = False
                        hasChange = True
                data["rules"][i]["processed"] = True
    


    m = 1
    for r in data["rules"]:
        if r["name"].startswith("departure"):
            idx = r["validity"].index(True)
            m *= data["ticket"][idx]
    print(m)

filename = "input.txt"
# filename = "sample_0.txt"
# filename = "sample_1.txt"

data = read_file(filename)
# print(data)
part1(data)
part2(data)