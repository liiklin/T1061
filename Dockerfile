FROM index.tenxcloud.com/docker_library/alpine:edge
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# 输入环境配置
RUN echo 'PORT=8001' >> .env \
  && echo 'NODE_ENV=development' >> .env \
  && echo 'DB_NAME=t1061' >> .env \
  && echo 'DB_URL=postgresql://t1061:t1061@localhost:5432/t1061' >> .env \
  && echo 'REDIS_PORT=6379' >> .env \
  && echo 'REDIS_URL=redis_t1061' >> .env \
  && echo 'REDIS_PASSWORD=' >> .env
# 安装依赖
RUN rm -rf /etc/apk/repositories
RUN echo '@edge http://mirrors.aliyun.com/alpine/edge/main' >> /etc/apk/repositories
RUN echo '@edge http://mirrors.aliyun.com/alpine/edge/community' >> /etc/apk/repositories
RUN apk update && apk upgrade
RUN apk add --no-cache nodejs-lts@edge
# COPY package.json /usr/src/app/
# RUN npm install -g yarn
# RUN yarn
# RUN npm install -g cnpm --verbose
# RUN npm install pm2@latest -g
RUN npm install
COPY . /usr/src/app
# 设置端口
EXPOSE 8001
# 线上环境
ENTRYPOINT nodemon ./bin/www.js
# CMD ['node','./bin/www.js']
