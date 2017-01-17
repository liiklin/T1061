# FROM daocloud.io/library/node:latest
FROM registry.alauda.cn/dubuqingfeng/centos7-nodejs
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
# 安装依赖
RUN yum install -y tar
RUN n latest
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm install -g n --registry=https://registry.npm.taobao.org
COPY . /usr/src/app
# 输入环境配置
RUN echo 'PORT=8001' >> .env \
  && echo 'NODE_ENV=development' >> .env \
  && echo 'DB_NAME=t1061' >> .env \
  && echo 'DB_URL=postgresql://t1061:t1061@pg_t1061:5432/t1061' >> .env \
  && echo 'REDIS_PORT=6379' >> .env \
  && echo 'REDIS_URL=redis_t1061' >> .env \
  && echo 'REDIS_PASSWORD=' >> .env
# 时区
RUN node -v
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN date
# 暴露端口
EXPOSE 8001
ENTRYPOINT node ./bin/www.js
