#! bin/bash
for VARIABLE in $(docker images --filter=reference='cortijo_*' --format "{{.Repository}}")
do
  NAME=${VARIABLE//cortijo_/}
  docker tag $VARIABLE enriqueramosmunoz/$NAME:$1
  docker push enriqueramosmunoz/$NAME:$1
done
