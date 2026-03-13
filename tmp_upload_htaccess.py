"""Upload .htaccess to HostUkraine FTP root."""
import ftplib

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

ftp = ftplib.FTP(HOST)
ftp.login(USER, PASSWORD)
ftp.cwd("/")

with open("tmp_htaccess.txt", "rb") as f:
    ftp.storbinary("STOR .htaccess", f)

print("Uploaded .htaccess to /")

# Also upload to /www/ in case it's needed there
ftp.cwd("/www")
with open("tmp_htaccess.txt", "rb") as f:
    ftp.storbinary("STOR .htaccess", f)

print("Uploaded .htaccess to /www/")
ftp.quit()
print("Done!")
