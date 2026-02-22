import pexpect
import sys

def run_ssh_command(cmd, password):
    print(f"Running ssh command: {cmd}")
    child = pexpect.spawn(f"ssh -p 8022 u0_a292@192.168.100.220 '{cmd}'", timeout=60)
    
    while True:
        i = child.expect(['(?i)password:', '(?i)are you sure you want to continue connecting', pexpect.EOF, pexpect.TIMEOUT])
        
        if i == 0:
            child.sendline(password)
        elif i == 1:
            child.sendline('yes')
        elif i == 2:
            print(child.before.decode('utf-8'))
            break
        elif i == 3:
            print("Timeout!")
            break

if len(sys.argv) > 1:
    run_ssh_command(sys.argv[1], "191020@")
