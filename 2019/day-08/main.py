size = 25*6












with open("input.txt") as f:
    line = f.readline().strip()
    # print(line)
    chunks, chunk_size = len(line), size
    layers = [ line[i:i+chunk_size] for i in range(0, chunks, chunk_size) ]
    min_zero = 99999999999999999
    result = None
    for layer in layers:
        # print(layer)
        current_zero = 0
        count_of_ones = 0
        count_of_twos = 0
        for i in range(0, len(layer)):
            if layer[i] == '0':
                current_zero += 1
            if layer[i] == '1':
                count_of_ones += 1
            if layer[i] == '2':
                count_of_twos += 1
        if current_zero < min_zero:
            min_zero = current_zero
            # print(count_of_ones, count_of_twos)
            result = count_of_ones * count_of_twos
    print(result)

    result = ''
    for i in range(0, size):
        color = '2'
        j = 0
        while j < len(layers) and color == '2':
            color = layers[j][i]
            j += 1
        result += color

    for i in range(0, len(result)):
        if i != 0 and i % 25 == 0:
            print('')
        # print(result[i], end ="")
        
        if result[i] == '0':
            print(' ', end = "")
        else:
            print('█', end = "")
