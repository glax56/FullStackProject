FROM node:14

# Install nodemon globally
RUN npm install -g nodemon

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]


# CMD ["nodemon", "app.js"]      
# CMD ["node", "app.js"]      

