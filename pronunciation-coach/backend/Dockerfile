FROM node:20-alpine AS base
# Install OpenSSL 
RUN apk add --no-cache openssl

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies and generate Prisma client
RUN npm ci --omit=dev
RUN npx prisma generate

COPY . .
EXPOSE 4000
CMD ["npm", "start"]