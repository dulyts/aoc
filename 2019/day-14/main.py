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

    def create(self):
        if self.chemical != 'ORE':
            r = RECEIPT[self.chemical]
            for c in r.input:
                MINIMAL_REQ[c.name].get(c.unit)

            self.count += 1
            self.rest += r.output.unit
        else:
            self.count += 1
            self.rest += 1

    def get(self, unit):
        while unit > self.rest:
            self.create()
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

def process(output_chemical):
    
    MINIMAL_REQ[output_chemical].get(c.unit)
    # inputs = RECEIPT[output_chemical].input
    # for i in inputs:
    #     print(i)
    #     # i = 7 A
    #     # factory = find_by_out(RECEIPT, i.name)
    #     MINIMAL_REQ[i.name].add(factory.input.unit, factory.output.unit, i.input.unit)
    #     if i.name != 'ORE':
    #         process(RECEIPT, i.name)
    #     # else:
    #     #     print(i.unit)

part1()

