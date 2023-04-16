#!/bin/sh
set -e

for file in $(find . -name "*.proto" -type f); do
  folder=$(basename "$file" .proto)
  mkdir -p "/genproto/$folder"
  protoc \
    --proto_path=. "$file" \
    "--go_out=/genproto/$folder" --go_opt=paths=source_relative \
    --go-grpc_opt=require_unimplemented_servers=false \
    "--go-grpc_out=/genproto/$folder" --go-grpc_opt=paths=source_relative

  #grpc_tools_node_protoc \
    #--proto_path=. \
    #"--js_out=import_style=commonjs,binary:/genproto/$folder" \
    #"--grpc_out=/genproto/$folder" \
    #"--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`" \
    #$file
done