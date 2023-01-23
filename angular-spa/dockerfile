FROM node:latest AS build
WORKDIR /app 
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17.1-alpine 
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/angular-spa /usr/share/nginx/html