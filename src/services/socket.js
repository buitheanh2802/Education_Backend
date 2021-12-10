const userNotification = [];

export const socketConfig = (io) => {
    io.on('connection',(socket) => {
        socket.on('join',(data) => {
           userNotification.push({
               socketId : socket.id,
               _id : data
           });
           socket.emit('responseForJoin',{ joined : true})
        });
        socket.on('sendTo',(data) => {
            userNotification.forEach(user => {
                if(user._id == data.sendToId){
                    const { sendToId,...rest } = data;
                    socket.to(user.socketId).emit('responseForSendTo',rest)
                }
            })
        })
    })
}