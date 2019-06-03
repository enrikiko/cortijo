n=0
for value in {1..5}
do
  name="fp-"$n
  sh fp.sh $name
  n=$((n+1))
done
