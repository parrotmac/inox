FROM node:alpine as backend-builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run tslint
RUN npm run build-ts

# Artifact: /app/dist/

FROM node:alpine

ENV NODE_ENV=production
WORKDIR /opt/

COPY --from=backend-builder /app/dist dist/
COPY --from=backend-builder /app/node_modules node_modules/

CMD ["node", "/opt/dist/app.js"]
