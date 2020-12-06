def read_file(file):
    answer_groups = []
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        answers = []
        number_of_people = 0
        for line in lines:
            if line == '':
                answer_groups.append((number_of_people, answers))
                answers = []
                number_of_people = 0
                continue
            for c in line:
                answers.append(c)
            number_of_people += 1
        
        answer_groups.append((number_of_people, answers))
    return answer_groups

def part1(data):
    sum = 0
    for group in data:
        unique_list = set(group[1])
        sum += len(unique_list)
    print(sum)


def part2(data):
    sum = 0
    for group in data:
        unique_list = set(group[1])
        for c in unique_list:
            if group[1].count(c) == group[0]:
                sum += 1
        # sum += len(unique_list)
    print(sum)

filename = "input.txt"
# filename = "sample_0.txt"
# filename = "sample_1.txt"

data = read_file(filename)
part1(data)
part2(data)