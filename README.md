# API de Achados e Perdidos

Atividade de Tecnologia e Construção de Software com servidor HTTP, aplicação Express e rotas/. Os caminhos e métodos seguem o quadro da atividade.

## Estrutura

- `server.js`: inicia o servidor na porta 3000.
- `app.js`: configura Morgan, Body Parser, CORS e registra as rotas.
- `rotas/objetoDao.js`: implementa as cinco operações usando SQL parametrizado.
- `rotas/mysql.js`: configura o pool de conexões MySQL/MariaDB.
- `script_banco/achados_perdidos.sql`: cria o banco e a tabela.
- `postman/AchadosPerdidos.postman_collection.json`: exemplos e verificações de respostas.

## Rotas

| Método | Caminho | Dados |
|---|---|---|
| GET | `/objetos` | Nenhum |
| GET | `/objeto?id=1` | ID na query |
| POST | `/objeto` | descricao, local, data, status no JSON |
| PUT | `/objeto` | id e todos os demais campos no JSON |
| DELETE | `/objeto` | id no JSON |

Exemplo de cadastro:

```json
{
  "descricao": "Carteira preta",
  "local": "Biblioteca",
  "data": "2026-10-10",
  "status": "Encontrado"
}
```

O ID é gerado pelo banco. Para atualizar, envie esse mesmo objeto com `"id": 1`. Para excluir, envie `{"id": 1}`. POST, PUT e DELETE recebem `Content-Type: application/json`.

O quadro não determina os valores de status: este projeto aceita texto obrigatório, como `Encontrado`, `Perdido` ou `Devolvido`. A data deve ser uma data real no formato AAAA-MM-DD. Os textos aceitam até 255 caracteres. PUT substitui todos os campos do objeto. A escolha de receber o ID no JSON para PUT e DELETE acompanha o exemplo do professor.

Respostas: 200 para consulta/atualização/exclusão, 201 para cadastro, 400 para dados inválidos, 404 para objeto ou rota inexistente e 500 para falha no banco. Uma lista vazia retorna `[]`.
