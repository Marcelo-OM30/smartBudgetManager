
// Service para consumir a API externa de transações
// Adapte a URL base conforme necessário
const API_BASE = 'http://localhost:3000/api/transactions'; // Exemplo, ajuste para sua API externa

// Helper para requisições com token
async function request(url, options = {}, token) {
    if (token) {
        options.headers = {
            ...(options.headers || {}),
            'Authorization': `Bearer ${token}`,
        };
    }
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

exports.getAll = async (token) => {
    return request(API_BASE, { method: 'GET' }, token);
};

exports.create = async (data, token) => {
    return request(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, token);
};

exports.update = async (id, data, token) => {
    return request(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, token);
};

exports.delete = async (id, token) => {
    return request(`${API_BASE}/${id}`, { method: 'DELETE' }, token);
};
