FROM fusionauth/fusionauth-app:1.45.3

USER root

# Install curl
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

USER fusionauth

COPY ./apps/frontend/public/favicon.ico /usr/local/fusionauth/fusionauth-app/web/static/images/favicon-128.png
COPY ./apps/frontend/public/favicon.ico /usr/local/fusionauth/fusionauth-app/web/static/images/favicon-16x16.png
COPY ./apps/frontend/public/favicon.ico /usr/local/fusionauth/fusionauth-app/web/static/images/favicon-32x32.png
COPY ./apps/frontend/public/favicon.ico /usr/local/fusionauth/fusionauth-app/web/static/images/favicon-96x96.png
