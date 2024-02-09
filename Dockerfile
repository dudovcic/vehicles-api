FROM node:18 as builder

WORKDIR /api

COPY package*.json ./api

RUN yarn install --frozen-lockfile

COPY . .

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD [ "node", "dist/main.js" ]