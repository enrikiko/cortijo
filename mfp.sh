n=0
for value in {1..3}
do
  n=$((n+1))
  name="mock"$n
  sh fp.sh $name
done
