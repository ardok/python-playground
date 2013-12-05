from flask import Flask, render_template, url_for
# -*- coding: utf-8 -*-
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
import requests
import base64


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


app = Flask(__name__, static_url_path='/static')

app.jinja_env.globals['static'] = (
    lambda filename: url_for('static', filename=filename))

@app.route("/")
def index():
  return render_template('index.html')

@app.route('/get_guide/<id>')
@crossdomain(origin='*')
def get_guide(id):
  """
  Method to get a guide from Snapguide, return the data as json string
  JS will need to parse it first
  """
  r = requests.get('http://snapguide.com/api/v1/guide/' + id)
  return r.text

@app.route('/get_image/<id>')
@crossdomain(origin='*')
def get_image(id):
  """
  Method to get an image from a guide by passing the hash id of the image
  Return the encoded 64 binary data of the image
  """
  endUrl = 'original.jpg'

  quality = ''
  if request.args != None:
    quality = request.args.get('q', '')
    if quality.lower() == 'medium':
      endUrl = '300x294_ac.jpg'
    elif quality.lower() == 'small':
      endUrl = '60x60_ac.jpg'
    else:
      endUrl = quality

  resp = requests.get('http://images.snapguide.com/images/guide/' + id + '/' + endUrl)
  bData = resp.content
  
  # JS doesn't like non-encoded binary, so we need to return the encoded one here
  return base64.b64encode(bData)

if __name__ == "__main__":
    app.debug = True
    app.run()