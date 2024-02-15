#!/bin/bash

# This script fetches data from a source database and inserts it into a destination database.

# Load environment variables from .env file
source ../../../../.env

psqlRemoteRequest() {
    export PGPASSWORD=$DEST_PASSWORD
    psql -h "$DEST_HOST" -p "$DEST_PORT" -d "$DEST_DB" -U "$DEST_USER" -c "$1"
    unset PGPASSWORD

    upsert_status=$?
    if [ $upsert_status -ne 0 ]; then
      echo "Error: Failed to upsert into the destination table with command $1."
      exit $upsert_status
    fi
}

psqlSourceRequest() {
    psql -h "$SOURCE_HOST" -p "$SOURCE_PORT" -d "$SOURCE_DB" -U "$SOURCE_USER" -c "$1"
}

# Fetch Function takes in a table name and stores the data in a csv file with the same name, also takes in what columns to select from database table, exits if the fetch fails
fetch() {
    psqlSourceRequest "COPY (SELECT $2 FROM $1) TO STDOUT WITH CSV HEADER" > $1.csv
    fetch_status=$?
    if [ $fetch_status -ne 0 ]; then
        echo "Error: Failed to fetch data from the $1 table."
        exit $fetch_status
    fi
    echo "$1 data fetched successfully."
}

# Upsert Function takes in a table name and upserts the data from the csv file with the same name into the destination table, also takes in a conflict finder, exits if the upsert fails
upsert() {
      psqlRemoteRequest "DROP TABLE IF EXISTS ${1//\"}_temp;"

      psqlRemoteRequest "CREATE TABLE IF NOT EXISTS ${1//\"}_temp (LIKE $1 INCLUDING ALL);"

      echo "Created temp table for $1"

      psqlRemoteRequest "\copy ${1//\"}_temp FROM '$1.csv' WITH CSV HEADER"

      echo "Copied data into temp table for $1"

      psqlRemoteRequest "INSERT INTO $1 $3 SELECT $4 FROM ${1//\"}_temp ON CONFLICT ($2) DO NOTHING;"

      echo "Upserted data into destination table for $1"

      psqlRemoteRequest "DROP TABLE ${1//\"}_temp;"

      echo "Dropped temp table for $1"

      echo "$1 data upserted successfully."
}

# Sets the script to exit if any command fails
set -e 

fetch "run" "*"

fetch "data" "*"

fetch "\"dataType\"" "*"

fetch "node" "*"

fetch "driver" "*"

fetch "location" "*"

fetch "system" "*"

echo "ALL DATA FETCHED BEGINNING TRANSFER"

upsert "node" "name" "" "name"

upsert "\"dataType\"" "name" "" "name, unit, \"nodeName\""

upsert "driver" "username" "" "username"

upsert "location" "name" "" "name, latitude, longitude, radius"

upsert "system" "name" "" "name"

upsert "run" "id" "" "id, \"locationName\", \"driverName\", \"systemName\", time"

upsert "data" "id, time" "" "id, values, \"dataTypeName\", time, \"runId\""

echo "Data transfer completed successfully."

echo "Beginning Cleanup"

# Delete data from the source table
psqlSourceRequest "DELETE FROM data;"
delete_status=$?

# If deleting data fails, display an error message but continue script execution
if [ $delete_status -ne 0 ]; then
    echo "Warning: Failed to delete data from the source table."
fi

# Delete run data from the source table
psqlSourceRequest "DELETE FROM run;"
delete_status=$?

# If deleting data fails, display an error message but continue script execution
if [ $delete_status -ne 0 ]; then
    echo "Warning: Failed to delete run data from the source table."
fi

rm \"dataType\".csv
rm driver.csv
rm location.csv
rm node.csv
rm system.csv
rm run.csv
rm data.csv

echo "Data deleted successfully."

echo "Cleanup completed with status ${delete_status}."
