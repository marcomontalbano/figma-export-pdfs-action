# FROM node:18-alpine

# ENTRYPOINT ["/github/workspace/entrypoint.sh"]

FROM node:18-alpine

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

ENTRYPOINT ["node", "-r", "tsm", "src/index.ts", "/github/workspace/dist/"]
