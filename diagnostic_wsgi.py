import sys
import traceback

def application(environ, start_response):
    try:
        from backend.main import app as fastapi_app
        from a2wsgi import ASGIMiddleware
        return ASGIMiddleware(fastapi_app)(environ, start_response)
    except Exception as e:
        status = "500 Internal Server Error"
        headers = [("Content-type", "text/plain; charset=utf-8")]
        start_response(status, headers)
        
        error_details = traceback.format_exc()
        py_version = sys.version
        
        output = f"""DIAGNOSTIC ERROR REPORT
=======================
Python Version: {py_version}

Traceback:
{error_details}
"""
        return [output.encode("utf-8")]
