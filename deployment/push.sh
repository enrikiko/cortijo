#! bin/bash
for VARIABLE in $(docker images --filter=reference='deployment_*' --format "{{.Repository}}")
do
  NAME=${VARIABLE//deployment_/}
  docker tag $VARIABLE enriqueramosmunoz/$NAME:1.0.0
  docker push enriqueramosmunoz/$NAME:1.0.0
done