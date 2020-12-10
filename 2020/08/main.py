def read_file(file):
    commands = []
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        for line in lines:
            s = line.split(' ')
            command = {
                "cmd": s[0],
                "param": s[1],
                "runned": False,
            }
            commands.append(command)
    return commands

def part1(commands):
    i = 0
    acc = 0
    # print(len(commands))
    while i < len(commands):
        # print("i:", i, "| cmd:", commands[i]["cmd"], "| param", int(commands[i]["param"]))
        if commands[i]["runned"]:
            # print("wtf")
            break

        if commands[i]["cmd"] == "nop":
            commands[i]["runned"] = True

        if commands[i]["cmd"] == "acc":
            commands[i]["runned"] = True
            acc += int(commands[i]["param"])

        if commands[i]["cmd"] == "jmp":
            commands[i]["runned"] = True
            i += int(commands[i]["param"])
            continue
        
        i += 1

    print(acc)



def part2(commands):
    found_wring_command = False
    ch_i = 0
    while not found_wring_command and ch_i < len(commands):
        if commands[ch_i]["cmd"] not in ["nop", "jmp"]:
            ch_i += 1
            continue
        for cmd in commands:
            cmd["runned"] = False


        error = False

        i = 0
        acc = 0
        # print(len(commands))
        while i < len(commands):
            # print("i:", i, "| cmd:", commands[i]["cmd"], "| param", int(commands[i]["param"]))
            if commands[i]["runned"]:
                error = True
                # print("wtf")
                break

            if (i == ch_i and commands[i]["cmd"] == "nop") or (i == ch_i and commands[i]["cmd"] == "jmp"):
                if i == ch_i and commands[i]["cmd"] == "nop":
                    commands[i]["runned"] = True
                    i += int(commands[i]["param"])
                    continue

                if i == ch_i and commands[i]["cmd"] == "jmp":
                    commands[i]["runned"] = True

            else:
                if commands[i]["cmd"] == "nop":
                    commands[i]["runned"] = True

                if commands[i]["cmd"] == "acc":
                    commands[i]["runned"] = True
                    acc += int(commands[i]["param"])

                if commands[i]["cmd"] == "jmp" or (i == ch_i and commands[i]["cmd"] == "nop"):
                    commands[i]["runned"] = True
                    i += int(commands[i]["param"])
                    continue
            
            i += 1

        print(ch_i, error)
        if not error:
            print(acc)
            return
        ch_i += 1


filename = "input.txt"
# filename = "sample_0.txt"

data = read_file(filename)
part1(data)
print("----------")
part2(data)