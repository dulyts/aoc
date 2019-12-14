from collections import defaultdict
import math

class keydefaultdict(defaultdict):
    def __missing__(self, key):
        if self.default_factory is None:
            raise KeyError( key )
        else:
            ret = self[key] = self.default_factory(key)
            return ret

class Chemical():
    def __init__(self, unit, name):
        self.name = name
        self.unit = int(unit)

    def __repr__(self):
        return f'chemical: {self.name}, units: {self.unit}'


class Reaction():

    def __init__(self, reciept):
        self.input = []
        self.output = None
        p = reciept.strip().split(' => ')
        o = p[1].split(' ')
        self.output = Chemical(o[0], o[1])
        for i in p[0].split(', '):
            ii = i.split(' ')
            self.input.append(Chemical(ii[0], ii[1]))

    def __repr__(self):
        return f'inputs: {self.input}, output: {self.output}'


RECEIPT = dict()

class Stock():

    def __init__(self, chemical):
        self.chemical = chemical
        self.count = 0
        self.rest = 0
        # part2
        if self.chemical == 'ORE':
            self.rest = 1000000000000

    def create(self, unit_req):
        # part1
        # if self.chemical != 'ORE':
        #     r = RECEIPT[self.chemical]
        #     for c in r.input:
        #         MINIMAL_REQ[c.name].get(c.unit)

        #     self.count += 1
        #     self.rest += r.output.unit
        # else:
        #     self.count += 1
        #     self.rest += 1

        # part2
        if self.chemical == 'ORE':
            raise Exception('ORE cant create')
        else:
            r = RECEIPT[self.chemical]
            asd = math.ceil(unit_req / r.output.unit)
            for c in r.input:
                MINIMAL_REQ[c.name].get(asd * c.unit) # unit_req * 

            self.count += asd
            self.rest += asd * r.output.unit
        

    def get(self, unit):
        # print('get', self.chemical, unit, self.rest)
        if self.rest == 0:
            req = unit
        else:
            req = unit - self.rest
        if req > 0:
        # while unit > self.rest:
            self.create(req)
        self.rest -= unit
    
    def __repr__(self):
        return f'{self.chemical} count: {self.count}, rest: {self.rest}'


MINIMAL_REQ = keydefaultdict(Stock)









def read_file(filename):
    with open(filename) as f:
        for line in f:
            react = Reaction(line)
            RECEIPT[react.output.name] = react

def part1():
    # read_file('test1.txt')
    read_file('input.txt')
    print(RECEIPT)
    # process('FUEL')
    MINIMAL_REQ['FUEL'].get(1)
    print(MINIMAL_REQ)
    print(MINIMAL_REQ['ORE'].count)
    return MINIMAL_REQ['ORE'].count

def part2():
    # read_file('test5.txt')
    read_file('input.txt')
    # print(RECEIPT)
    # process('FUEL')
    fuel = int(1000000000000 // 720484)
    fuel = 1887955
    print('fuel', fuel)
    MINIMAL_REQ['FUEL'].get(fuel)
    # fuel = 0
    try:
        while True:
            MINIMAL_REQ['FUEL'].get(1)
            fuel += 1
            if fuel % 1000000 == 0:
                print(fuel)
    except:
        pass
    print(fuel)
    # print(MINIMAL_REQ)
    # print(MINIMAL_REQ['ORE'].count)


# part1()
part2()

