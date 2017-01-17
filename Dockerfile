FROM registry.alauda.cn/dubuqingfeng/centos7-nodejs
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
# 安装依赖
RUN yum install -y tar ntp
RUN npm install -g n
RUN n latest
RUN npm install
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
RUN ls /etc/rc.d/init.d/
RUN /etc/rc.d/init.d/ntpd start
RUN /etc/rc.d/init.d/ntpdd status
RUN date
# 暴露端口
EXPOSE 8001
ENTRYPOINT node ./bin/www.js
