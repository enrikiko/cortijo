#! /bin/bash
echo "Starting $0"
text=$(python ./randomSentence.py)
sh makeSomeChange.sh
cd ./Java
git pull
git add .
git commit -m "$text"
git push
cd ..
