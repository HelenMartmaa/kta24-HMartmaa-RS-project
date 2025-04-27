# Kasutame ametlikku Node.js pilti
FROM node:18

# Määrame töökausta konteineris
WORKDIR /app

# Kopeerime package.json ja installime sõltuvused
COPY package*.json ./
RUN npm install

# Kopeerime ülejäänud koodi konteinerisse
COPY . .

# Käivitame Reacti arenduskeskkonna
EXPOSE 3002

# Käivitame rakenduse
CMD ["npm", "start"]

