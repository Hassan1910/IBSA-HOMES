import pexpect
import sys

def run_command(cmd, password):
    print(f"Running: {cmd}")
    child = pexpect.spawn(cmd, timeout=30)
    
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
            print("Timeout waiting for prompt.")
            break

run_command("scp -P 8022 /home/hassan/.ssh/id_rsa.pub u0_a292@192.168.100.220:~/", "191020@")
