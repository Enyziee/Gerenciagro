FROM node:22.2.0-slim as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --development

COPY tsconfig*.json ./
COPY src/ src/

RUN npm run build

FROM node:22.2.0-slim as production

WORKDIR /app 

COPY package*.json ./

RUN npm ci --production

COPY --from=development /usr/src/app/dist ./dist

CMD npx typeorm migration:run -d ./dist/db/DataSource.js && node dist/app.js
