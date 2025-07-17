FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["node", "dist/main"]