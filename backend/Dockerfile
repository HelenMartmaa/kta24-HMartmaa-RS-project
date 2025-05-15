# Kasutame ametlikku Node.js pilti
FROM node:18

# Loome ja määrame töökausta
WORKDIR /app

# Kopeerime package.json ja installime sõltuvused
COPY package*.json ./

# Tööriistad ja sõltuvused
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && npm install

# Kopeerime kõik failid
COPY . .

# Eksponeerime porti, kus backend töötab
EXPOSE 3001

# Käivitame back-endi serveri
CMD ["npm", "start"]