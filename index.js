// ładujemy odpowiednie moduły
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// tworzymy aplikację Express i serwer HTTP, podpinamy socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
//importujemy moduł obsługujący uzytkowników
const UsersService = require('./UsersService');

const usersService = new UsersService();

// ustawienie w aplikacji Express miejsca, z którego będą serwowane pliki
app.use(express.static(`${__dirname}/public`));

// skonfigurowanie routingu
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

//f. nasłuchuje na połączenie klienta z aplikacją
io.on('connection', (socket) => {

  // klient nasłuchuje na wiadomość wejścia do czatu
  socket.on('join', (name) => {
    // użytkownika, który pojawił się w aplikacji, zapisujemy do serwisu trzymającego listę osób w czacie
    usersService.addUser({
      id: socket.id,
      name
    });
    // aplikacja emituje zdarzenie update, które aktualizuje informację na temat listy użytkowników każdemu nasłuchującemu na wydarzenie 'update'
    io.emit('update', {
      users: usersService.getAllUsers()
    });
  });

  io.on('connection', (socket) => {
    // funkcja ma się wykonać po utraceniu połączenia klienta z serwerem,
    socket.on('disconnect', () => {
      usersService.removeUser(socket.id);
      socket.broadcast.emit('update', {
        users: usersService.getAllUsers()
      });
    });

    //wysyłanie wiadomości
    socket.on('message', (message) => {
      const {name} = usersService.getUserById(socket.id);
      socket.broadcast.emit('message', {
        text: message.text,
        from: name
      });
    });
  });
});

// uruchomienie serwera i nasłuchiwanie
server.listen(3000, () => {
  console.log('listening on *:3000');
});
