FROM nginx:alpine

ENV TZ=America/Sao_Paulo

COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/default.conf.template /etc/nginx/templates/default.conf.template

COPY certs/gerenciagro_me_chain.crt /etc/nginx/certs/ssl_certificate.crt
COPY certs/gerenciagro.key /etc/nginx/certs/ssl_certificate.key
