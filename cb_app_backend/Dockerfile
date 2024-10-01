FROM node:20 AS backend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:20 AS development
WORKDIR /app
COPY --from=backend-build /app .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]


FROM node:20 AS production
WORKDIR /app
COPY --from=backend-build /app .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
