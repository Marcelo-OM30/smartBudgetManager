// auth.js - Autenticação básica (estrutura inicial)

// Função para registrar usuário (simulação localStorage)
function registerUser(name, email, password, photoData) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
        alert('Usuário já existe!');
        return false;
    }
    // Criptografia simples (hash SHA-256)
    window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        users[email] = {
            password: hashHex,
            name: name,
            photo: photoData || null
        };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Usuário registrado com sucesso!');
        window.location.href = 'index.html';
    });
}

// Função para login
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[email]) {
        alert('Usuário não encontrado!');
        return;
    }
    window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password)).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const userData = users[email];
        const userPassword = typeof userData === 'string' ? userData : userData.password;

        if (userPassword === hashHex) {
            localStorage.setItem('loggedUser', email);
            // Salvar dados do usuário para uso no dashboard
            localStorage.setItem('currentUserData', JSON.stringify(userData));
            window.location.href = 'dashboard.html';
        } else {
            alert('Senha incorreta!');
        }
    });
}

// Eventos de formulário
if (document.getElementById('registerForm')) {
    // Preview da foto
    document.getElementById('registerPhoto').addEventListener('change', function (e) {
        const file = e.target.files[0];
        const preview = document.getElementById('photoPreview');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.innerHTML = `<img src="${e.target.result}" class="photo-preview" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    });

    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerPasswordConfirm').value;

        if (password !== confirm) {
            alert('As senhas não coincidem!');
            return;
        }

        const photoFile = document.getElementById('registerPhoto').files[0];
        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                registerUser(name, email, password, e.target.result);
            };
            reader.readAsDataURL(photoFile);
        } else {
            registerUser(name, email, password, null);
        }
    });
}
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        loginUser(email, password);
    });
}

// Função de logout
function logoutUser() {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('currentUserData');
    window.location.href = 'index.html';
}

// Função para atualizar perfil do usuário
function updateUserProfile(name, photoData) {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
        alert('Usuário não está logado!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[loggedUser]) {
        alert('Usuário não encontrado!');
        return;
    }

    // Atualizar dados do usuário
    if (typeof users[loggedUser] === 'string') {
        // Usuário antigo (só tem senha), converter para novo formato
        users[loggedUser] = {
            password: users[loggedUser],
            name: name,
            photo: photoData
        };
    } else {
        // Usuário novo, atualizar campos
        if (name) users[loggedUser].name = name;
        if (photoData) users[loggedUser].photo = photoData;
    }

    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUserData', JSON.stringify(users[loggedUser]));

    // Atualizar interface
    loadUserProfile();
    alert('Perfil atualizado com sucesso!');
}

// Função para carregar perfil do usuário
function loadUserProfile() {
    const loggedUser = localStorage.getItem('loggedUser');
    const currentUserData = localStorage.getItem('currentUserData');

    let userData = null;

    if (currentUserData) {
        try {
            userData = JSON.parse(currentUserData);
        } catch (e) {
            console.error('Erro ao parsear dados do usuário:', e);
        }
    }

    // Atualizar header (presente em todas as páginas)
    const userGreeting = document.getElementById('userGreeting');
    const userPhoto = document.getElementById('userPhoto');

    if (userGreeting) {
        userGreeting.textContent = userData?.name ? `Olá, ${userData.name}!` : `Olá, ${loggedUser || 'Usuário'}!`;
    }

    if (userPhoto && userData?.photo) {
        userPhoto.src = userData.photo;
    }

    // Atualizar página de perfil (se existir)
    if (document.getElementById('currentName')) {
        document.getElementById('currentName').textContent = userData?.name || 'Não informado';
        document.getElementById('currentEmail').textContent = loggedUser || 'Não informado';

        const currentPhoto = document.getElementById('currentProfilePhoto');
        if (userData?.photo) {
            currentPhoto.src = userData.photo;
        } else {
            currentPhoto.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjZTBlN2VmIi8+CjxwYXRoIGQ9Ik01MCA1MEM1Ny45NTY0IDUwIDY0LjE2NjcgNDMuNzg5OCA2NC4xNjY3IDM2LjY2NjdDNjQuMTY2NyAyOS41NDM1IDU3Ljk1NjQgMjMuMzMzMyA1MCAyMy4zMzMzQzQyLjA0MzYgMjMuMzMzMyAzNS44MzMzIDI5LjU0MzUgMzUuODMzMyAzNi42NjY3QzM1LjgzMzMgNDMuNzg5OCA0Mi4wNDM2IDUwIDUwIDUwWiIgZmlsbD0iIzQ0NCIvPgo8cGF0aCBkPSJNNTAgNTguMzMzM0MzOS43MjIyIDU4LjMzMzMgMjcuNzc3OCA1OS40MTY3IDIwLjgzMzMgNjMuODg4OUMxNy45MTY3IDY1LjY5NDQgMTYuNjY2NyA2OC4zMzMzIDE2LjY2NjcgNzEuMzg4OVY4My4zMzMzSDgzLjMzMzNWNzEuMzg4OUM4My4zMzMzIDY4LjMzMzMgODIuMDgzMyA2NS42OTQ0IDc5LjE2NjcgNjMuODg4OUM3Mi4yMjIyIDU5LjQxNjcgNjAuMjc3OCA1OC4zMzMzIDUwIDU4LjMzMzNaIiBmaWxsPSIjNDQ0Ii8+Cjwvc3ZnPg==";
        }
    }
}
