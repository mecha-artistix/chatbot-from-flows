FROM node:20 AS frontend-build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm run build




# Production stage
FROM nginx:1.24 AS production

COPY --from=frontend-build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM node:20 AS development

WORKDIR /app

COPY --from=frontend-build /app .

EXPOSE 5173

CMD ["npm", "run", "dev"]