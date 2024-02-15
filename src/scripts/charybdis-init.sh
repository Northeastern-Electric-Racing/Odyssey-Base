#!/bin/bash
# Make Sure Your Local Database is setup

source ../../../../.env

# Dump the database to a file

pg_dump -d "$SOURCE_DATABASE_URL" \                         
  --format=plain \                                 
  --quote-all-identifiers \
  --no-tablespaces \                              
  --no-owner \
  --no-privileges \
  --file=dump.sql

# If Dumping fails exit
if [ $fetch_status -ne 0 ]; then
    echo "Error: Failed to dump the database."
    exit $fetch_status
fi

echo "Database dumped successfully."

# Transfer the file to the remote server

psql $TARGET -v ON_ERROR_STOP=1 --echo-errors \
    -c "SELECT public.timescaledb_pre_restore();" \
    -f dump.sql \
    -c "SELECT public.timescaledb_post_restore();"

# If transfer fails exit
if [ $insert_status -ne 0 ]; then
    echo "Error: Failed to transfer the database."
    exit $insert_status
fi

# Delete the file from the local machine
rm dump.sql

echo "Database transfer completed successfully."
