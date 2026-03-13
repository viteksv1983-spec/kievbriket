"""Download the live main.py and find the seed-drova-live endpoint code."""
import ftplib
import io

ftp = ftplib.FTP("leadgin.ftp.tools")
ftp.login("leadgin_vitya", "xQ3wxZtiD1jdL3mnB7be")

buf = io.BytesIO()
ftp.retrbinary("RETR /www/backend/main.py", buf.write)
ftp.quit()

content = buf.getvalue().decode("utf-8")
print(f"Live main.py: {len(content)} bytes, {content.count(chr(10))} lines")

# Find all seed-related routes
lines = content.split("\n")
for i, line in enumerate(lines):
    if "seed" in line.lower() and ("def " in line or "@app" in line or "route" in line):
        # Print surrounding context
        start = max(0, i-1)
        end = min(len(lines), i+30)
        print(f"\n--- Lines {start+1}-{end+1} ---")
        for j in range(start, end):
            print(f"  {j+1}: {lines[j]}")
        print("---")
