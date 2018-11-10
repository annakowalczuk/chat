//Serwis obsługujący użytkowników
class UsersService {
  constructor() {
    this.users = [];
  }

  //zwrócenie tablicy użytkowników
  getAllUsers() {
    return this.users;
  }

  //odszukanie użytkownika po wskazanym przez nas id
  getUserById(userId) {
    return this.users.find(user => user.id === userId);
  }

  //dodajemy kolejną osobę do listy
  addUser(user) {
    this.users = [user, ...this.users];
  }

  //usunięcie wskazaneg uzytkownika
  removeUser(userId) {
    this.users = this.users.filter(user => user.id !== userId);
  }
}
module.exports = UsersService;
