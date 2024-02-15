# Odyssey-base
Shared Functions/Types Between Odyssey Applications

### Configuration for Initial Migration

run ```docker run -e POSTGRES_HOST_AUTH_METHOD=trust -p 5432:5432 -ti --platform=linux/amd64 timescale/timescaledb:2.13.1-pg15``` to get the timescale docker database on your local

with a cleared migrations folder in your prisma folder run ```npx prisma migrate dev --create-only```

then go into the created migration file and under the ```CREATE UNIQUE INDEX "data_id_time_key" ON "data"("id", "time");``` write the following

```
SELECT * FROM create_hypertable('data', by_range('time'));
SELECT * FROM add_dimension('data', by_hash('id', 4));
```

then run ```npx prisma migrate dev```

if you ever want to reseed database run ```npm run prisma:seed```

now with the setup database, create a new timescaledb on the cloud, obtain required credentials: host, port, password, user, database name

put these in a .env file

cd into the scripts directory

run ```./charybdis-init.sh```

this will dump the schema and all the data from our database into the clouddb (make sure environment names match up)

### Adding new data to cloud

with an initialized database you can just run ```./charybdis.sh``` to add all the data from our local database to the cloud
