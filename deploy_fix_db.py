import ftplib
import io

print('Uploading fix_db.php to HostUkraine...')
ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')

php_script = """<?php
$db_file = __DIR__ . '/backend/sql_app.db';
$db_folder = __DIR__ . '/backend';

echo "DB File exists: " . (file_exists($db_file) ? 'Yes' : 'No') . "<br>";
echo "DB Folder exists: " . (file_exists($db_folder) ? 'Yes' : 'No') . "<br>";

chmod($db_file, 0666);
chmod($db_folder, 0777);
chmod(__DIR__, 0777);

echo "Chmod commands executed.<br>";
echo "DB Writable: " . (is_writable($db_file) ? 'Yes' : 'No') . "<br>";
echo "Folder Writable: " . (is_writable($db_folder) ? 'Yes' : 'No') . "<br>";
?>"""

try:
    ftp.storbinary('STOR /www/fix_db.php', io.BytesIO(php_script.encode('utf-8')))
    print('Uploaded fix_db.php')
except Exception as e:
    print('Error uploading:', e)

ftp.quit()
