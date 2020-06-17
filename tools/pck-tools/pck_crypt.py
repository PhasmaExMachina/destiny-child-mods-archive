import os
from Crypto.Cipher import AES

key_korean = b"\x37\xea\x79\x85\x86\x29\xec\x94\x85\x20\x7c\x1a\x62\xc3\x72\x4f\x72\x75\x25\x0b\x99\x99\xbd\x7f\x0b\x24\x9a\x8d\x85\x38\x0e\x39"
key_global = b"\xef\xbb\xbf\xec\x8b\x9c\xed\x94\x84\xed\x8a\xb8\xec\x97\x85\xea\xb3\xbc\xeb\x9d\xbc\xec\x9d\xb8\xea\xb2\x8c\xec\x9e\x84\xec\xa6"

try:
  key_region = os.environ['KEY_REGION']
except:
  key_region = 'kr'

print(key_region)

# change accordingly
key = key_global if key_region == 'global' else key_korean

decipher = AES.new(key, AES.MODE_ECB)


def decrypt(file_bytes):
    padding = (16 - (len(file_bytes) % 16))
    file_bytes += padding * b"\x00"
    return decipher.decrypt(file_bytes)[:len(file_bytes)-padding]
