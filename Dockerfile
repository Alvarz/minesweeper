# Dockerfile
FROM node:12
WORKDIR /app

COPY . .
RUN rm -rf /app/node_modules
RUN npm install

# RUN npm ci --only=production

EXPOSE 4000

CMD [ "node", "index.js" ]