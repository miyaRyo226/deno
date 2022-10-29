FROM denoland/deno:1.27.0

# The port that your application listens to.
# EXPOSE 1993

WORKDIR /app

RUN apt-get update

# 必要なライブラリのインストール
RUN apt-get install -y gettext \
    libcurl4-gnutls-dev \
    libexpat1-dev \
    libghc-zlib-dev \
    libssl-dev \
    make \
    wget

# Gitをソースからコンパイルしてインストール
RUN wget https://github.com/git/git/archive/v2.30.0.tar.gz \
    && tar -xzf v2.30.0.tar.gz \
    && cd git-* \
    && make prefix=/usr/local all \
    && make prefix=/usr/local install

# Prefer not to run as root.
# USER deno


# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
# COPY deps.ts .
# RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
# ADD . .
# # Compile the main app so that it doesn't need to be compiled each startup/entry.
# RUN deno cache main.ts

# CMD ["run", "--allow-net", "main.ts"]