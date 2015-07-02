FROM node:latest

# Bundle app source
COPY . /teralogics/totalbriecall
# Install app dependencies
RUN cd /teralogics/totalbriecall; npm install

EXPOSE 5000
ENV PORT=5000

ENTRYPOINT ["node", "/teralogics/totalbriecall/app/index.js"]
