FROM nginx:alpine
RUN rm /etc/nginx/conf.d/*
COPY conf.d /etc/nginx/conf.d

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]