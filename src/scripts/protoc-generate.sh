#!/usr/bin/env bash

# Directory of where this script is being executed from
ROOT_DIR=$(pwd)

# Current directory of script
CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Path to Protoc Plugin
PROTOC_GEN_TS_PATH="${ROOT_DIR}/node_modules/.bin/protoc-gen-ts"

# Directory holding all .proto files
SRC_DIR="${CURRENT_DIR}/../types/proto"

# Directory to write generated code (.d.ts files)
OUT_DIR="${CURRENT_DIR}/../generated"

# Clean all existing generated files
rm -r "${OUT_DIR}"
mkdir "${OUT_DIR}"

# Generate all messages
protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --ts_opt=esModuleInterop=true \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="${OUT_DIR}" \
    --proto_path="${SRC_DIR}" \
    $(find "${SRC_DIR}" -iname "*.proto")