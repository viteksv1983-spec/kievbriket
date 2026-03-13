import sys

def application(environ, start_response):
    status = '200 OK'
    headers = [('Content-type', 'text/plain; charset=utf-8')]
    start_response(status, headers)
    
    # Use `.format()` instead of f-strings for broad compatibility
    output = "Hello from minimal WSGI!\\nPython: {0}\\nExec: {1}".format(
        sys.version.replace('\n', ' '), sys.executable
    )
    return [output.encode('utf-8')]
