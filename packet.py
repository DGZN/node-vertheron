# from scapy.all import *
# packet = IP(dst="192.168.7.1")/ICMP()/"Helloooo!"
# send(packet)
# packet.show()

from scapy.all import *
output=sr(IP(dst='google.com')/ICMP())
print '\nOutput is:'
print output
result, unanswered=output
print '\nResult is:'
print result
