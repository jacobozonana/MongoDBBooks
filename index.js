const express = require('express');
// const { response, request } = require('express');
const mongoose = require('mongoose');

const { config } = require('./config')

const app = express();

mongoose.connect(config.db.url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Conectado!!'))
.catch((err)=> console.log('Hubo un error de conexion', err));



// Authors

const authorSchema = new mongoose.Schema({
    nombre : String,
    biografia : String,
    fecha_de_nacimiento : String,
    nacionalidad : String 
})

// Books

const bookSchema = new mongoose.Schema({
    titulo : String,
    paginas : Number,
    isbn : String,
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
    },
});

const Authors = mongoose.model("Authors", authorSchema);
const Books = mongoose.model("Books", bookSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));


app.get('/', (request, response)=>{
    response.send('Funciona')
});

app.get('/author', (request, response)=>{
    Authors.find()
    .then((rDB)=> response.status(200).json(rDB))
    .catch((err)=> response.status(400).json(err));
});

app.get("/author/:id", (request, response)=>{
    Authors.findById(request.params.id)
    .then((rDB)=> response.status(200).json(rDB))
    .catch((err)=> response.status(400).json(err));

})

app.post('/author', (request, response)=>{
    const{ body } = request;
    const newAuthor = new Authors(body)
    newAuthor.save()
    .then((rDB)=> response.status(201).json(rDB))
    .catch((err)=> response.status(400).json(err));
});

app.patch('/author/:id', (request, response)=>{
    Authors.findByIdAndUpdate(request.params.id, request.body)
    .then((rDB)=> response.status(201).json(rDB))
    .catch((err)=> response.status(400).json(err));

});

app.delete('/author/:id', (request, response)=>{
    Authors.findByIdAndDelete(request.params.id)
    .then((rDB)=> response.status(204).json(rDB))
    .catch((err)=> response.status(400).json(err));

});

app.get('/book', (request, response)=>{
    Books.find()
    .then((rDB)=> response.status(200).json(rDB))
    .catch((err)=> response.status(400).json(err));
});

app.get('/book/:id', (request, response)=>{
    const { id } = request.params;
    Books.findById(id, (err, book)=>{
        Authors.populate(book, {path: 'author'}, (err, book)=>{
            response.status(200).send(book)
        })
    })
})

app.post('/book', (request, response)=>{
    const{ body } = request;
    const newBook = new Books(body)
    newBook
    .save()
    .then((rDB)=> response.status(201).json(rDB))
    .catch((err)=> response.status(400).json(err));
});

app.patch('/book/:id', (request, response)=>{
    Books.findByIdAndUpdate(request.params.id, request.body)
    .then((rDB)=> response.status(201).json(rDB))
    .catch((err)=> response.status(400).json(err));

});

app.delete('/book/:id', (request, response)=>{
    Articulos.findByIdAndDelete(request.params.id)
    .then((rDB)=> response.status(204).json(rDB))
    .catch((err)=> response.status(400).json(err));

});


app.listen (config.port, ()=> console.log(`Api esta activa en puerto: ${config.port}`))