FROM ubuntu:20.04

LABEL maintainer="Arulkumar"
LABEL description="Multi-language environment for web IDE"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  openjdk-11-jdk \
  curl \
  golang \
  rustc \
  cargo \
  gcc \
  g++ \
  make \
  php \
  php-cli \
  bash \
  nano \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN python3 --version \
  && java -version \
  && node --version \
  && npm --version \
  && go version \
  && rustc --version \
  && gcc --version \
  && g++ --version \
  && php --version

CMD ["bash"]