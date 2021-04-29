const { io } = require('../index')
const Band = require('../models/band');
const Bands = require('../models/bands');
//Mensajes de sockets
const bands = new Bands();
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Banda 3'));
bands.addBand(new Band('Banda 4'));
console.log('bandas: ', bands);
io.on('connection', (client) => {
    console.log('Cliente conectado');
    client.emit('active-bands', bands.getBands());
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    })
    client.on('mensaje', (mensaje) => {
        console.log(mensaje);
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    })
    client.on('flutter', (mensaje) => {
        console.log(mensaje);
        io.emit('flutter-io', { flutter: 'mensaje recibido desde flutter' });
    })
    client.on('vote-band', (payload) => {
        console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })
    client.on('delete-band', (payload) => {
        console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })
    client.on('add-band', (payload) => {
        console.log(payload);
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    })
    client.on('emitir-mensaje', (payload) => {
        console.log('Desde la web se recibio el  mensaje: ', payload);
        io.emit('nuevo-mensaje', payload);
    })
});