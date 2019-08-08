from flask import Flask, render_template, request
from werkzeug import secure_filename
import os
app = Flask(__name__)


@app.route('/upload', methods = ['GET', 'POST'])
def upload_file():
  f = request.files['file']
  f.save(secure_filename(f.filename))
  return 'file uploaded successfully'

@app.route('/liveness', methods = ['GET'])
def liveness():
    return "I am alive"

@app.route('/http', methods = ['GET'])
def http():
    return '''<html>
       <body>
          <form action = "http://88.8.65.164:8200/upload" method = "POST"
             enctype = "multipart/form-data">
             <input type = "file" name = "file" />
             <input type = "submit"/>
          </form>
       </body>
    </html>'''

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=3000)
