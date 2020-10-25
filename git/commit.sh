#! /bin/bash
echo "Starting $0"
sleep 60
text=$(python ./randomSentence.py)
pushd ./Java
git pull
popd
sh makeSomeChange.sh
pushd ./Java
git add .
git commit -m "$text"
git push
popd
