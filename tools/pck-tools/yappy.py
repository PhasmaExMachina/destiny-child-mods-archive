_yappy_maps = [[0 for y in range(16)] for x in range(32)]
_yappy_info = [0 for i in range(256)]
def yappy_fill():
    step = 1 << 16
    for i in range(16):
        value = 65535
        step = (step * 67537) >> 16
        while value < (29 << 16):
            _yappy_maps[value >> 16][i] = 1
            value = (value * step) >> 16

    cntr = 0
    for i in range(29):
        for j in range(16):
            if _yappy_maps[i][j]:
                _yappy_info[32 + cntr] = i + 4 + (j << 8)
                _yappy_maps[i][j] = 32 + cntr
                cntr += 1
            else:
                if i == 0:
                    raise Exception("i == 0")
                _yappy_maps[i][j] = _yappy_maps[i - 1][j]
    if cntr != 256 - 32:
        raise Exception("init error")
yappy_fill()

def yappy_uncompress(data, size):
    to = []

    data_p = 0
    to_p = 0
    while len(to) < size:
        # fail safe if not compressed
        if not data_p+1 < len(data):
            return data

        index = data[data_p] & 0xFF
        if index < 32:
            to.extend(data[data_p + 1:][:index + 1])
            to_p += index + 1
            data_p += index + 2
        else:
            info = _yappy_info[index]
            length = info & 0x00ff
            offset = (info & 0xff00) + (data[data_p+1] & 0xFF)
            to.extend(to[to_p - offset:][:length])
            to_p += length
            data_p += 2

    return bytearray(to)
