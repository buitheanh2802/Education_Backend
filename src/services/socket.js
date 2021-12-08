const userNotification = [];

export const socketConfig = (io) => {
    io.on('connection',(socket) => {
        console.log('has user to join');
    })
}