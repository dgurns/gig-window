FROM nginx:alpine

COPY default-with-ssl.conf.template /etc/nginx/conf.d/default-with-ssl.conf.template
COPY docker-entrypoint.sh /

RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]