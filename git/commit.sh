#! /bin/bash
echo "Starting $0"
text=$(python ./randomSentence.py)
pusd ./Java
git pull
popd
sh makeSomeChange.sh
pusd ./Java
git add .
git commit -m "$text"
git push
popd
