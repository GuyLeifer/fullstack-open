const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('post', function(req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else {
    return " ";
  }
})

app.use(express.json())

// app.use(morgan('tiny'))
app.use(morgan(function (tokens, req, res) {
  console.log(tokens.method(req, res)),
  console.log(tokens.url(req, res)),
  console.log(tokens.status(req, res)),
  console.log(tokens.res(req, res, 'content-length'), '-'),
  console.log(tokens['response-time'](req, res), 'ms'),
  console.log(tokens['post', (req, res)])
}))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    },
  ]

// app.get('/', (req, res) => {
//   res.send('<h1>Welcome To Local Host Port 3000!</h1>')
// })

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  const p = `Phonebook has info for ${persons.length + 1} people`;
  const date = new Date();
  res.send(p + " " + date)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.send(persons)
  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name already exists' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  // response.json(person)
  response.send(persons)
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})