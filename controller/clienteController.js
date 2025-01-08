const criarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body)
        res.send(cliente)
    } catch (err) {
        res.status(500).send({
            message: err.message,
        })
    }
}

const atualizarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body)
        res.send(cliente)
    } catch (err) {
        res.status(500).send({
            message: err.message,
        })
    }
}

const carregarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id)
        res.send(cliente)
    } catch (err) {
        res.status(500).send({
            message: err.message,
        })
    }
}

const deletarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id)
        res.send(cliente)
    } catch (err) {
        res.status(500).send({
            message: err.message,
        })
    }
}

const webhookCliente = async (req, res) => {
    try {
        const cliente = await Cliente.create(req.body)
        res.send(cliente)
    } catch (err) {
        res.status(500).send({
            message: err.message,
        })
    }
}

module.exports = {
    criarCliente,
}