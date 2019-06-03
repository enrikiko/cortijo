n=0
for run in {1..5}
do
  name="fp-"$run
  sh fp.sh $name
  n=$((n+1))
done
