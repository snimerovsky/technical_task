FROM node:18-alpine
WORKDIR "/technical_task/notification"
COPY ./package.json ./
RUN npm install --legacy-peer-deps
RUN apk --update --no-cache add curl
COPY . .
RUN npm run build
CMD ["npm", "run", "start:dev-prod"]
