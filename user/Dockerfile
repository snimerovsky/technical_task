FROM node:18-alpine
WORKDIR "/technical_task/user"
COPY ./package.json ./
RUN npm install --legacy-peer-deps
RUN apk --update --no-cache add curl
COPY . .
RUN npm run build
EXPOSE 5001
CMD ["npm", "run", "start:dev-prod"]
