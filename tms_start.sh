cd /home/ubuntu/Tms_server/appstarter
NODE_ENV=production PORT=3000 pm2 start server.sh --name tms_server
cd /home/ubuntu/Tms_server/frontend_jayden
NODE_ENV=production PORT=3002 pm2 start start.sh --name tms_fronted


