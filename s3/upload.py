import boto3
import os
from botocore.exceptions import NoCredentialsError


ACCESS_KEY = os.environ['ACCESS_KEY']
SECRET_KEY = os.environ['SECRET_KEY']
BUCKETS_NAME = os.environ['BUCKETS_NAME']

def upload_to_aws(local_file):
    global BUCKETS_NAME
    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY)
    try:
        s3.upload_file(local_file, BUCKETS_NAME, local_file)
        print("Upload Successful")
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False
    except NoCredentialsError:
        print("Credentials not available")
        return False
