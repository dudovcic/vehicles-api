FROM node:18 as builder

WORKDIR /api

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV production

RUN npx prisma generate

RUN npm run build

FROM node:18 As production

WORKDIR /api

ENV NODE_ENV production

COPY --from=builder /api/node_modules ./node_modules
COPY --from=builder /api/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main.js" ]