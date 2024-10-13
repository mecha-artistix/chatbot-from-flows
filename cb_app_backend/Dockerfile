FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:20 AS production
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]


FROM node:20 AS development
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]


FROM build AS worker
CMD ["node", "dist/worker.js"]
