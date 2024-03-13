FROM fusionauth/fusionauth-app:1.45.3

USER root

# Install curl
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

USER fusionauth
