#!/bin/bash
sudo mv /tmp/rs.conf /etc/nginx/conf.d/rs.kendrickheller.com.conf
sudo chown -R nginx:nginx /var/www/html/upload/kendrickheller
sudo chmod -R 755 /var/www/html/upload/kendrickheller
sudo systemctl restart nginx
