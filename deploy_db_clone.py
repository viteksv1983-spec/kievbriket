import ftplib
import io

print('Uploading python clone script to HostUkraine...')
ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')

py_script = """import shutil
import os

def clone_db():
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'sql_app.db')
    backup_path = os.path.join(os.path.dirname(__file__), 'backend', 'sql_app_backup.db')
    
    results = []
    
    if os.path.exists(db_path):
        try:
            shutil.copy2(db_path, backup_path)
            os.remove(db_path)
            shutil.copy2(backup_path, db_path)
            results.append("DB cloned successfully, ownership taken by web worker!")
        except Exception as e:
            results.append(f"Error cloning DB: {str(e)}")
    else:
        results.append("DB not found at " + db_path)
        
    return str(results)

# Return this via ASGI
async def app(scope, receive, send):
    assert scope['type'] == 'http'
    res = clone_db()
    await send({
        'type': 'http.response.start',
        'status': 200,
        'headers': [(b'content-type', b'text/plain')],
    })
    await send({
        'type': 'http.response.body',
        'body': res.encode('utf-8'),
    })
"""

try:
    ftp.storbinary('STOR /www/main.py', io.BytesIO(py_script.encode('utf-8')))
    print('Uploaded clone script to main.py')
except Exception as e:
    print('Error uploading:', e)
    
print('Restarting passenger...')
try:
    ftp.storbinary("STOR /www/tmp/restart.txt", io.BytesIO(b"Restart"))
except: pass

ftp.quit()
