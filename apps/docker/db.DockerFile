FROM postgres:15-alpine

ENV POSTGRES_DB=mindspark
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=main0228

VOLUME /var/lib/postgresql/data

EXPOSE 5432