# FROM node:16-alpine

# ENTRYPOINT ["/github/workspace/entrypoint.sh"]

FROM node:16-alpine

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

ENTRYPOINT ["npm", "run", "export", "/github/workspace/dist/"]
