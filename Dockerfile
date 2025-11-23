# Dockerfile
FROM node:20-alpine

# Radni direktorijum u kontejneru
WORKDIR /usr/src/app

# Kopiraj package fajlove i instaliraj zavisnosti
COPY package*.json ./
RUN npm install --only=production

# Kopiraj ostatak projekta
COPY . .

# Promenljive okruženja
ENV NODE_ENV=production
ENV PORT=3000

# Port na kojem app sluša
EXPOSE 3000

# Start komanda
CMD ["node", "src/index.js"]
