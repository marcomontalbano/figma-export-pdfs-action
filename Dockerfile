# FROM node:18-alpine

# ENTRYPOINT ["/github/workspace/entrypoint.sh"]

FROM node:18-alpine

WORKDIR /figma-export-pdfs-action

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

ENTRYPOINT ["npm", "--prefix", "/figma-export-pdfs-action", "run", "export", "/github/workspace/dist/"]
