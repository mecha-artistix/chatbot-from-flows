FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build


# Development stage
FROM build AS development
WORKDIR /app
EXPOSE 5173
CMD ["npm", "run", "dev"]