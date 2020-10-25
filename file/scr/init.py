import os
from werkzeug import secure_filename
from flask import Flask, render_template, request, send_from_directory, json
app = Flask(__name__)

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    f = request.files['file']
    print("Filename:" + f.filename)
    res=f.save(os.path.join('files', secure_filename(f.filename)))
    return "res"

@app.route('/download', methods=['GET', 'POST'])
def download_file():
    filename = request.args.get('file', None)
    if filename is None:
        return "invalid request"
    return send_from_directory("./files/", filename, as_attachment=True)

@app.route('/files', methods=['GET', 'POST'])
def list_file():
    list = os.listdir("./files")
    tuple_list = tuple(list)
    response = app.response_class(
        response=json.dumps(list),
        status=200,
        mimetype='application/json'
    )
    return response

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
