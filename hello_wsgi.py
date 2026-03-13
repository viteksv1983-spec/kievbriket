import sys

def application(environ, start_response):
    status = '200 OK'
    headers = [('Content-type', 'text/plain; charset=utf-8')]
    start_response(status, headers)
    
    # We dump sys.version and sys.executable to see WHICH python is running!
    output = f"Hello from minimal WSGI!\nPython: {sys.version}\nExec: {sys.executable}"
    return [output.encode('utf-8')]
