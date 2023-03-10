#base image
FROM nginx:alpine

COPY ./build/ /usr/share/nginx/html/

COPY ./config/*.key /etc/ssl/private/nginx-selfsigned.key
COPY ./config/*.crt /etc/ssl/certs/nginx-selfsigned.crt
COPY ./config/*.conf /etc/nginx/conf.d/default.conf

ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

HEALTHCHECK --interval=60s --timeout=10s CMD curl --fail http://127.0.0.1:5000 || exit 1
