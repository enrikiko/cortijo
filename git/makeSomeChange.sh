#! /bin/bash
text=$(python ./randomSentence.py)
date >> ./Java/newFile.txt
echo  $text >> ./Java/newFile.txt
echo " \n " >> ./Java/newFile.txt
