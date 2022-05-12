FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install all the yarn stuff
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn install

# Bundle app source
COPY . .

RUN yarn prisma-generate
RUN yarn compile

EXPOSE 3000
CMD ["yarn", "dev"]
