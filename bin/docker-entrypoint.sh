#!/usr/bin/bash

# docker run -d --name "postgresql" -h "postgresql" -p 5432:5432 -e POSTGRES_PASSWORD=gun2onCogh -v /var/lib/postgresql/data:/var/lib/postgresql/data:Z postgres

# create postgres db and user for greentea
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_SERVER -U postgres <<EOF
    CREATE USER alphabet WITH PASSWORD '$POSTGRES_PASSWORD';
    CREATE DATABASE alphabet owner alphabet;
    ALTER USER alphabet CREATEDB;
EOF

mkdir -p /data/log/
source /data/env/bin/activate
PRODUCTION=$( find /data/ -name production.py | grep "settings/production.py" )
export DJANGO_SETTINGS_MODULE="alphabet.settings"
if [ ! -z $PRODUCTION ]; then
    export DJANGO_SETTINGS_MODULE="alphabet.settings.production"
fi

# python /data/manage.py migrate --fake-initial --noinput || exit
python /data/manage.py migrate --noinput || exit
python /data/manage.py collectstatic --noinput
# python manage.py compilemessages
uwsgi --http :80 --thunder-lock --enable-threads --master --wsgi-file /data/alphabet/wsgi.py #--daemonize /data/log/uwsgi.log
