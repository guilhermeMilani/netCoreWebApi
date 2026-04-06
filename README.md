# Contacts API

API REST para gerenciamento de contatos, desenvolvida com ASP.NET Core e SQLite.

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Postman](https://www.postman.com/downloads/)

## Como rodar

### 1. Clonar o repositório
```bash
git clone (https://github.com/guilhermeMilani/netCoreWebApi/blob/main/README.md)
cd Backend
```

### 2. Aplicar as migrations
```bash
dotnet ef database update
```

### 3. Rodar a aplicação
```bash
dotnet run
```

A API estará disponível em `http://localhost:5132`.

---

## Endpoints

### Listar todos os contatos
```
GET /api/contacts
```

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Guilherme",
    "email": "gui@email.com",
    "phone": "47999999999"
  }
]
```

---

### Buscar contato por ID
```
GET /api/contacts/{id}
```

**Resposta:**
```json
{
  "id": 1,
  "name": "Guilherme",
  "email": "gui@email.com",
  "phone": "47999999999"
}
```

---

### Criar contato
```
POST /api/contacts
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Guilherme",
  "email": "gui@email.com",
  "phone": "47999999999"
}
```

**Resposta:** `201 Created`

---

### Atualizar contato
```
PUT /api/contacts/{id}
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Guilherme Silva",
  "email": "gui@email.com",
  "phone": "47999999999"
}
```

**Resposta:** `204 No Content`

---

### Deletar contato
```
DELETE /api/contacts/{id}
```

**Resposta:** `204 No Content`

---

## Testando no Postman

1. Abra o Postman e crie uma nova **Collection** chamada `Contacts API`
2. Para cada endpoint, crie uma nova requisição dentro da collection
3. Nos endpoints `POST` e `PUT`, vá em **Body → raw → JSON** e cole o body correspondente
4. Certifique-se de que a aplicação está rodando antes de fazer as requisições

---

## Documentação interativa

Com a aplicação rodando, acesse o Swagger em:
```
http://localhost:5132/swagger
```

## Frontend

### Requisitos

- [Node.js](https://nodejs.org/)

### Como rodar
```bash
cd Frontend/contacts
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> Certifique-se de que o backend está rodando antes de abrir o frontend.
