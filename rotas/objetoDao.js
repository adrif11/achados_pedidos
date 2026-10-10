const express = require('express');
const router = express.Router();
const banco = require('./mysql');

function idValido(id) {
    return (typeof id === 'string' || typeof id === 'number') &&
        /^[1-9]\d*$/.test(String(id)) && Number.isSafeInteger(Number(id));
}

function dadosValidos(dados) {
    if (!dados || !['descricao', 'local', 'status'].every(campo =>
        typeof dados[campo] === 'string' && dados[campo].trim().length > 0 &&
        dados[campo].length <= 255)) return false;
    if (typeof dados.data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dados.data)) return false;
    const ano = Number(dados.data.slice(0, 4));
    const data = new Date(`${dados.data}T00:00:00.000Z`);
    return ano >= 1000 && ano <= 9999 && !Number.isNaN(data.getTime()) &&
        data.toISOString().slice(0, 10) === dados.data;
}

// O pool obtém e libera a conexão automaticamente em cada consulta.
function consultar(sql, parametros, res, sucesso) {
    banco.query(sql, parametros, (erro, resultado) => {
        if (erro) {
            console.error('Erro no banco:', erro.code);
            return res.status(500).json({ mensagem: 'Não foi possível executar a operação no banco.' });
        }
        sucesso(resultado);
    });
}

router.get('/objetos', (req, res) => {
    consultar('SELECT id, descricao, local, data, status FROM objeto ORDER BY id', [], res,
        objetos => res.status(200).json(objetos));
});

router.get('/objeto', (req, res) => {
    if (!idValido(req.query.id)) return res.status(400).json({ mensagem: 'Informe um ID inteiro positivo na query.' });
    consultar('SELECT id, descricao, local, data, status FROM objeto WHERE id = ?',
        [Number(req.query.id)], res, objetos => {
            if (!objetos.length) return res.status(404).json({ mensagem: 'Objeto não encontrado.' });
            res.status(200).json(objetos[0]);
        });
});

router.post('/objeto', (req, res) => {
    if (!dadosValidos(req.body)) return res.status(400).json({ mensagem: 'Informe descricao, local, status e uma data válida no formato AAAA-MM-DD. Textos devem ter de 1 a 255 caracteres.' });
    const { descricao, local, data, status } = req.body;
    consultar('INSERT INTO objeto (descricao, local, data, status) VALUES (?, ?, ?, ?)',
        [descricao, local, data, status], res, resultado => {
            res.location(`/objeto?id=${resultado.insertId}`);
            res.status(201).json({ id: resultado.insertId, descricao, local, data, status });
        });
});

router.put('/objeto', (req, res) => {
    if (!idValido(req.body?.id) || !dadosValidos(req.body)) return res.status(400).json({ mensagem: 'Informe id inteiro positivo e todos os campos válidos no corpo JSON.' });
    const { id, descricao, local, data, status } = req.body;
    consultar('UPDATE objeto SET descricao = ?, local = ?, data = ?, status = ? WHERE id = ?',
        [descricao, local, data, status, Number(id)], res, resultado => {
            if (!resultado.affectedRows) return res.status(404).json({ mensagem: 'Objeto não encontrado.' });
            res.status(200).json({ id: Number(id), descricao, local, data, status });
        });
});

router.delete('/objeto', (req, res) => {
    if (!idValido(req.body?.id)) return res.status(400).json({ mensagem: 'Informe um ID inteiro positivo no corpo JSON.' });
    consultar('DELETE FROM objeto WHERE id = ?', [Number(req.body.id)], res, resultado => {
        if (!resultado.affectedRows) return res.status(404).json({ mensagem: 'Objeto não encontrado.' });
        res.status(200).json({ mensagem: 'Objeto excluído.', id: Number(req.body.id) });
    });
});

module.exports = router;
