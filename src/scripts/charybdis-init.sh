#!/bin/bash
# This file is used to run the prisma migrations into the production database

source ../../../../.env

echo "SOURCE_DATABASE_URL=\"$CLOUD_DATABASE_URL\"" >> ../../../../.env

npx prisma migrate deploy --preview-feature

if [ $? -ne 0 ]; then
  echo "Error: Failed to deploy migrations."
  exit 1
fi

# Remove the SOURCE_DATABASE_URL from the .env file
sed -i '/SOURCE_DATABASE_URL/d' ../../../../.env

echo "Migrations Deployed Successfully"