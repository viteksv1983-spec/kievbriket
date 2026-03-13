def application(environ, start_response):
    status = '200 OK'
    body = b"PASSENGER_IS_ALIVE_AND_UPDATED"
    start_response(status, [
        ('Content-Type', 'text/plain; charset=utf-8'),
        ('Content-Length', str(len(body)))
    ])
    return [body]
