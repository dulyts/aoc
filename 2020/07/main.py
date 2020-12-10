def read_file(file):
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        data = {}
        for line in lines:
            a = line.split(' bags contain ')
            if a[1] == 'no other bags.':
                continue
            data[a[0]] = []
            b = a[1].split(', ')
            for i in b:
                c = i.split(' ')
                d = {
                    'count': c[0],
                    'color': ' '.join(c[1:3])
                }
                data[a[0]].append(d)
        return data


def part1(data, search, unique):
    count = 0
    for i in data.keys():
        for j in data[i]:
            if j['color'] == search and i not in unique:
                unique.add(i)
                count += 1 + part1(data, i, unique)
    return count

def part2(data, search):
    if search not in data:
        return 0
    count = 0
    for i in data[search]:
        count += int(i['count'])
        count += int(i['count']) * part2(data, i['color'])
    return count

filename = "input.txt"
# filename = "sample_0.txt"
# filename = "sample_1.txt"

data = read_file(filename)
print(part1(data, 'shiny gold', set()))
print(part2(data, 'shiny gold'))