#! /bin/bash
echo "Starting commit.sh"
text=$(python ./randomSentence.py)
sh makeSomeChange.sh
cd ./Java
git pull
git add .
git commit -m "$text"
git push
cd ../
