
# input = '206938-679128'

count = 0
for i in range(206938, 679128):
    sn = str(i)
    if (sn[0] <= sn[1] <= sn[2] <= sn[3] <= sn[4] <= sn[5] and
        (sn[0] == sn[1] or
        sn[1] == sn[2] or
        sn[2] == sn[3] or
        sn[3] == sn[4] or
        sn[4] == sn[5])):
        same = 1
        j = 1
        while j < 6:
            if sn[j-1] == sn[j]:
                same += 1
            else:
                if same == 2:
                    break
                same = 1
            j += 1
        if same == 2:
            count += 1
            print(i)
    # print(i)
print(count)