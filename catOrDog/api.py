from flask import Flask, render_template, request
from werkzeug import secure_filename
import os
app = Flask(__name__)


@app.route('/upload', methods = ['GET', 'POST'])
def upload_file():
  f = request.files['file']
  f.save(os.path.join(app.instance_path, 'files'), secure_filename(f.filename))
  return 'file uploaded successfully'

@app.route('/liveness', methods = ['GET'])
def liveness():
    return "I am alive"

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=3000)
