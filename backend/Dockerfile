# Kasutame ametlikku Node.js pilti
FROM node:18

# Loome ja määrame töökausta
WORKDIR /app

# Kopeerime package.json ja installime sõltuvused
COPY package*.json ./
RUN npm install

# Kopeerime kõik failid
COPY . .

# Eksponeerime porti, kus backend töötab
EXPOSE 3001

# Käivitame back-endi serveri
CMD ["npm", "start"]

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  && npm install
