const users = [];
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async ({ email, password }) => {
    if (users.find(u => u.email === email)) throw new Error('Usuário já existe');
    const hash = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, email, password: hash };
    users.push(user);
    return { id: user.id, email: user.email };
};

exports.login = async ({ email, password }) => {
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Usuário não encontrado');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Senha inválida');
    return jwt.sign({ id: user.id, email: user.email }, 'segredo', { expiresIn: '1h' });
};
