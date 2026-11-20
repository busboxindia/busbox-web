FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ARG VITE_MAPBOX_TOKEN
ARG VITE_PLAY_STORE_URL
ARG VITE_APP_STORE_URL
ARG VITE_SUPPORT_EMAIL
ARG VITE_SUPPORT_PHONE
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback so /t/<token> deep links work; long cache for hashed assets only.
RUN printf 'server {\n listen 80;\n root /usr/share/nginx/html;\n server_tokens off;\n location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; try_files $uri =404; }\n location / { add_header Cache-Control "no-cache"; try_files $uri /index.html; }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
