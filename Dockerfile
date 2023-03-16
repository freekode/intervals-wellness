# stage 1
FROM node:16 as build
WORKDIR /app

COPY . /app
RUN npm ci
RUN npm run build --prod

# stage 2
FROM nginx:alpine as runtime
COPY --from=build /app/dist/intervals-wellness /usr/share/nginx/html