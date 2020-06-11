FROM node:alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install typescript -g
RUN npm install --production --no-audit
RUN npm run build
CMD ["npm", "run", "prod"]
