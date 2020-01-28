var exp = require('express') //importar o express para montar o servidor
var bodyParser = require('body-parser') //importar o bodyparser para lidar com as arrays
var app = exp() //define app como a própria função do express
var http = require('http').Server(app) //chama a biblioteca http e cria um servidor com app
var io = require('socket.io')(http) //chama o socket.io para o servidor
var mongoose = require('mongoose') //importa o mongoose para conectar com o o db

app.use(exp.static(__dirname)) //define o diretório do servidor express
app.use(bodyParser.json()) //usa o bodyparse importado para cuidar do JSON
app.use(bodyParser.urlencoded({extended:false})) //???

//link para o db, incluindo username e password
var dbUrl = 'mongodb+srv://pbsc:wlmvccE6paAmpBNg@dbpbsc-mzrlo.mongodb.net/dbpbsc?retryWrites=true&w=majority'

var dbModelObj = mongoose.model('collobjs', {
    objNome: String,
    objDesc: String,
})

var objetivos = []

app.get('/objetivos', (req, res) => {
    dbModelObj.find({}, (err, objetivos) => {
        res.send(objetivos)    
    })
})

app.post('/objetivos', (req, res) => {
    var objetivo = new dbModelObj(req.body)
    var objSalvo = objetivo.save()
    console.log('Salvo')
    io.emit('objetivos', req.body)
    res.sendStatus(200)
})


io.on('connection', (socket) => {console.log('SOCKET IO Mahn...')})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    console.log('mongo db connectado', err)
})

http.listen(3000)