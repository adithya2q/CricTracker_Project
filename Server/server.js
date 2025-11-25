const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: 'https://cric-tracker-project-frontend.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'x-custom-header'], 
    credentials: true
}));


dbconfig=require('./dbconfig/index.js');
const router=require('./routes.js');

app.get('/', (req, res) => {
  res.status(200).send('CricTracker Pro website is running');
});

const server=require('http').createServer(app);
const io=require('socket.io')(server);

io.on('connection',socket=>{
    console.log('Client is connected');

    socket.on('joinRoom',matchId=>{
        socket.join(matchId);
    })

    socket.on('disconnect',()=>{
        console.log('Client is disconnected');
    })
})

app.use('',router(io));


const PORT=process.env.PORT;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});

