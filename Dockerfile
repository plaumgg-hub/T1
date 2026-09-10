FROM ghcr.io/puppeteer/puppeteer:latest

# ตั้งค่าความปลอดภัยและเส้นทาง Chrome บน Render
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "bot.js"]
