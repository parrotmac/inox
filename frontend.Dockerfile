FROM node:alpine as frontend-builder

WORKDIR /usr/src/app

COPY fe/package.json .
COPY fe/package-lock.json .

RUN npm install

COPY fe/ .

ARG REACT_APP_MAPBOX_API_TOKEN
ENV REACT_APP_MAPBOX_API_TOKEN=$REACT_APP_MAPBOX_API_TOKEN
ENV NODE_ENV=production

RUN npm run build

# Artifact: /usr/src/app/build

FROM nginx:alpine

WORKDIR /app/build

COPY fe/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-builder /usr/src/app/build /app/build
