// Modelo de Usuario (en memoria por ahora)
class User {
  constructor() {
    this.users = [
      {
        id: 1,
        dni: "12345678",
        name: "Luis Fernando",
        lastName: "Gallegos Ballon",
        email: "luis.gallegos@gmail.com",
        password: "123456",
        role: "user",
        status: "active",
        phone: "+51 987 654 321",
        address: "Av. La Cultura 123, Cusco"
      },
      {
        id: 2,
        dni: "87654321",
        name: "Administrador",
        lastName: "Sistema",
        email: "admin@ciudadsegura.com",
        password: "admin123",
        role: "admin",
        status: "active",
        phone: "+51 999 888 777",
        address: "Municipalidad de Cusco"
      }
    ];
  }

  findAll() {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  findById(id) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  findByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  create(userData) {
    const newUser = {
        id: this.users.length + 1,
        ...userData,
        role: 'user',
        status: 'active',
        address: '', // Campo vacío por defecto
        phone: userData.phone || '', // <-- Agregar teléfono
        createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
} 

  update(id, updates) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    // Actualizar solo campos permitidos (teléfono y password)
    const allowedFields = ['phone', 'password', 'address']; // <-- Agregar password
    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
        this.users[index][field] = updates[field];
        }
    });
    
    const { password, ...updatedUser } = this.users[index];
    return updatedUser;
}
}

module.exports = new User();