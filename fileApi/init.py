import os
from werkzeug import secure_filename
from flask import Flask, render_template, request, send_from_directory
app = Flask(__name__)

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    f = request.files['file']
    print("Filename:" + f.filename)
    res=f.save(secure_filename(f.filename))
    return "res"

@app.route('/download', methods=['GET', 'POST'])
def download_file():
    return "res"
    filename = request.args.get('file', None)
    if filename is None:
        filename = "init.sh"
    res = send_from_directory(".", filename, as_attachment=True)



@app.route('/liveness', methods=['GET'])
def liveness():
    return "I am alive"


@app.route('/favicon.ico', methods=['GET'])
def favicon():
    return send_from_directory('/src', 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/', methods=['GET'])
def http():
    return '''
    <html>
       <body>
          <form action = upload method = "POST"
             enctype = "multipart/form-data">
             <input type = "file" name = "file" />
             <input type = "submit"/>
          </form>
       </body>
    </html>
    '''


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3000)
