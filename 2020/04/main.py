
import re


def contains_all_required_field(id):
    if ('byr' in id and
        'iyr' in id and
        'eyr' in id and
        'hgt' in id and
        'hcl' in id and
        'ecl' in id and
        'pid' in id):
        return True
    return False


def part1(ids):
    valid_ids = 0
    for id in ids:
        if contains_all_required_field(id):
            valid_ids += 1
            continue

    print(valid_ids)

def part2(ids):
    valid_ids = 0
    for id in ids:
        if not contains_all_required_field(id):
            continue
        
        if int(id['byr']) < 1920 or int(id['byr']) > 2002:
            # print("not valid byr", id)
            continue
        
        if int(id['iyr']) < 2010 or int(id['iyr']) > 2020:
            # print("not valid iyr", id)
            continue
        
        if int(id['eyr']) < 2020 or int(id['eyr']) > 2030:
            # print("not valid eyr", id)
            continue

        hgt_unit = id['hgt'][-2:]
        if hgt_unit == "cm":
            if int(id['hgt'][:-2]) < 150 or int(id['hgt'][:-2]) > 193:
                # print("not valid hgt", id)
                continue
        else:
            if hgt_unit == "in":
                if int(id['hgt'][:-2]) < 59 or int(id['hgt'][:-2]) > 76:
                    # print("not valid hgt", id)
                    continue
            else:
                continue

        hcl_match = re.match(r"^#[a-f0-9]{6}$", id['hcl'])
        if not hcl_match:
            # print("not valid hcl", id)
            continue

        if id['ecl'] not in ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']:
            # print("not valid ecl", id)
            continue

        pid_match = re.match(r"^[0-9]{9}$", id['pid'])
        if not pid_match:
            # print("not valid pid", id)
            continue

        valid_ids += 1

    print(valid_ids)

filename = "input.txt"
# filename = "sample.txt"
# filename = "4_invalid.txt"
# filename = "4_valid.txt"

def read_data(filename):
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        
        ids = []
        new_id = {}
        for line in lines:
            if line == "":
                ids.append(new_id)
                new_id = {}
                continue
            for data in line.split(" "):
                data_parts = data.split(":")
                new_id[data_parts[0]] = data_parts[1]
        ids.append(new_id)
        return ids

ids = read_data(filename)
part1(ids)
part2(ids)