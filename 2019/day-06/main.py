

nodes = dict()




def process(rootNode, depth):
    print(rootNode, depth)
    if len(rootNode["children"]) == 0:
        return depth
    # sum = len(rootNode["children"])
    sum = depth
    for i in rootNode["children"]:
        sum += process(nodes[i], depth+1)
    print(sum)
    return sum





# asd = 'COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L'

def pathFinder(nodeName, to):
    if nodeName == to:
        return [nodeName]
    if len(nodes[nodeName]["children"]) == 0:
        return []
    for i in nodes[nodeName]["children"]:
        tmp = pathFinder(i, to)
        # print(tmp)
        if len(tmp) > 0:
            tmp.insert(0, nodeName)
            return tmp
    return []



asd = 'COM)B\nB)C\nC)D\nD)E\nE)F\nB)G\nG)H\nD)I\nE)J\nJ)K\nK)L\nK)YOU\nI)SAN'



with open("input.txt") as f:
    root = None
    # f = asd.split('\n')
    for line in f:
        node = line.strip().split(')')
        
        if node[0] in nodes:
            nodes[node[0]]["children"].append(node[1])
        else:
            nodes[node[0]] = {}
            nodes[node[0]]["children"] = [node[1]]
            # nodes[node[0]] = {
            #     "children": [node[1]]
            # }
        if node[1] not in nodes:
            nodes[node[1]] = {}
            nodes[node[1]]["children"] = []
    # print(nodes)

    # print(process(nodes['COM'], 0))
        
    pathToYOU = pathFinder('COM', 'YOU')
    pathToSAN = pathFinder('COM', 'SAN')
    print(pathToYOU)
    print(pathToSAN)
    minCount = 999999999999999
    countYou = 0
    for i in reversed(pathToYOU):
        countSan = 0
        for j in reversed(pathToSAN):
            if i == j:
                print(i, j, countYou, countSan)
                fullPath = countYou + countSan
                if fullPath < minCount:
                    minCount = fullPath
            countSan +=1
        countYou += 1
    print(minCount-2)