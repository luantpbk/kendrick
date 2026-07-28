#!/bin/bash
sudo mkdir -p /var/www/html/upload
sudo rm -rf /var/www/html/upload/kendrickheller
sudo mv /tmp/upload_kendrickheller /var/www/html/upload/kendrickheller

if id -u www-data >/dev/null 2>&1; then
  sudo chown -R www-data:www-data /var/www/html/upload/kendrickheller
elif id -u nginx >/dev/null 2>&1; then
  sudo chown -R nginx:nginx /var/www/html/upload/kendrickheller
else
  sudo chown -R nobody:nobody /var/www/html/upload/kendrickheller
fi

if ! command -v nginx >/dev/null 2>&1; then
  sudo apt-get update && sudo apt-get install -y nginx || sudo dnf install -y nginx
fi

cat << 'EOF' | sudo tee /etc/nginx/conf.d/rs.kendrickheller.com.conf > /dev/null
server {
    listen 80;
    server_name rs.kendrickheller.com;

    location / {
        root /var/www/html;
        autoindex on;
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
    }
}
EOF

# Optional: If on Ubuntu, /etc/nginx/sites-available is used. Just to be safe, link it:
if [ -d /etc/nginx/sites-available ]; then
  sudo ln -sf /etc/nginx/conf.d/rs.kendrickheller.com.conf /etc/nginx/sites-available/rs.kendrickheller.com.conf
  sudo ln -sf /etc/nginx/sites-available/rs.kendrickheller.com.conf /etc/nginx/sites-enabled/
fi

sudo nginx -t && sudo systemctl restart nginx || echo "Nginx config error"
