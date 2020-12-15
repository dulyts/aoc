

def solve(data, n):
    last_spoken = [(-1, -1) for i in range(0,n)]
    for i in range(0, len(data)):
        last_spoken[data[i]] = (-1, i+1)
    last = data[-1]
    for i in range(len(data), n):
        if last_spoken[last][1] == -1:
            last_spoken[last] = (-1, i+1)
            last = 0
            continue
        if last_spoken[last][0] == -1:
            last_spoken[0] = (last_spoken[0][1], i+1)
            last = 0
            continue
        last = last_spoken[last][1]-last_spoken[last][0]
        last_spoken[last] = (last_spoken[last][1], i+1)
    return last
        

datas = [
    {
        "data": [0,3,6],
        "result_1": 436,
        "result_2": 175594
    },{
        "data": [1,3,2],
        "result_1": 1,
        "result_2": 2578
    },{
        "data": [2,1,3],
        "result_1": 10,
        "result_2": 3544142
    },{
        "data": [1,2,3],
        "result_1": 27,
        "result_2": 261214
    },{
        "data": [2,3,1],
        "result_1": 78,
        "result_2": 6895259
    },{
        "data": [3,2,1],
        "result_1": 438,
        "result_2": 18
    },{
        "data": [3,1,2],
        "result_1": 1836,
        "result_2": 362
    },{
        "data": [11,0,1,10,5,19],
        "result_1": 0,
        "result_2": 0
    }
]

for i in datas:
    pr = solve(i["data"], 2020)
    print(",".join([str(j) for j in i["data"]]), pr, pr == i["result_1"])

for i in datas:
    pr = solve(i["data"], 30000000)
    print(",".join([str(j) for j in i["data"]]), pr, pr == i["result_2"])
