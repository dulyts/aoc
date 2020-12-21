def read_file(filename):
    data = []
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        for line in lines:
            d = {}
            p = line.split(" (contains ")
            d["ingredients"] = p[0].split(" ")
            d["allergens"] = p[1][:-1].split(", ")
            data.append(d)
    return data

def intersection(lst1, lst2): 
    lst3 = [value for value in lst1 if value in lst2] 
    return lst3 

def part1(data):
    processed_allergen = {}
    processed_i = []
    allergen_map = {}
    all_ingredient = set()
    for i in range(0,10):
        for d in data:
            for i in d["ingredients"]:
                all_ingredient.add(i)
            for a in d["allergens"]:
                if a in processed_allergen:
                    continue
                if a not in allergen_map:
                    allergen_map[a] = set([x for x in d["ingredients"] if x not in processed_i])
                same_i = [x for x in intersection(d["ingredients"], list(allergen_map[a])) if x not in processed_i]
                if len(same_i) == 1:
                    processed_allergen[a] = same_i[0]
                    processed_i.append(same_i[0])
                    del allergen_map[a]
                    for i in allergen_map.keys():
                        if same_i[0] in allergen_map[i]:
                            allergen_map[i].remove(same_i[0])
                else:
                    allergen_map[a] = set(same_i)
                    
    result = [x for x in list(all_ingredient) if x not in processed_i]
    c = 0
    for d in data:
        for i in d["ingredients"]:
            if i in result:
                c += 1
    print(c)

    return processed_allergen

def part2(processed_allergen):
    asd = [x for x in processed_allergen]
    asd.sort()
    asd = ",".join([processed_allergen[y] for y in asd])
    print(asd)

filename = "input.txt"
# filename = "sample_0.txt"

data = read_file(filename)
# print(data)
processed_allergen = part1(data)
part2(processed_allergen)