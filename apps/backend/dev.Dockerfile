FROM docker.io/node:20.10.0-alpine
USER root
RUN npm install -g nx
USER 1000:1000
WORKDIR /app
RUN chown -R 1000:1000 /app

EXPOSE 3001

CMD ["nx", "start:dev", "backend"]
