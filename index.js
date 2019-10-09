const express = require('express');
const pagarme = require('pagarme');
require('dotenv-safe').config();

const app = express();

const transactionJson = require('./json/transaction.json')

const card = {
    card_number: '4111111111111111',
    card_holder_name: 'abc',
    card_expiration_date: '1225',
    card_cvv: '123',
}

app.get('/transaction', (req, res) => {
    pagarme.client.connect({ api_key: process.env.API_KEY })
        .then(client => client.transactions.create(transactionJson))
        .then(transaction => res.send(transaction))
});

app.get('/retrieve', (req, res) => {
    pagarme.client.connect({ api_key: process.env.API_KEY })
        .then(client => client.transactions.capture({ id: '7087838' }))
        .catch(e => res.send(e))
});

app.get('/hashcard', (req, res) => {
    pagarme.client.connect({ api_key: process.env.API_KEY })
    .then(client => client.security.encrypt(card))
    .then(card_hash => res.send(card_hash))
});

app.get('/transhash', (req, res) => {
    pagarme.client.connect({ api_key: process.env.API_KEY })
        .then(client => client.security.encrypt(card))  
        .then(client => client.transactions.create({
            "amount": 10000,
            "card_hash": card_hash,
            "customer": {
              "external_id": "#3311",
              "name": "Morpheus Fishburne",
              "type": "individual",
              "country": "br",
              "email": "mopheus@nabucodonozor.com",
              "documents": [
                {
                  "type": "cpf",
                  "number": "30621143049"
                }
              ],
              "phone_numbers": ["+5511999998888", "+5511888889999"],
              "birthday": "1965-01-01"
            },
            "billing": {
              "name": "Trinity Moss",
              "address": {
                "country": "br",
                "state": "sp",
                "city": "Cotia",
                "neighborhood": "Rio Cotia",
                "street": "Rua Matrix",
                "street_number": "9999",
                "zipcode": "06714360"
              }
            },
            "shipping": {
              "name": "Neo Reeves",
              "fee": 1000,
              "delivery_date": "2000-12-21",
              "expedited": true,
              "address": {
                "country": "br",
                "state": "sp",
                "city": "Cotia",
                "neighborhood": "Rio Cotia",
                "street": "Rua Matrix",
                "street_number": "9999",
                "zipcode": "06714360"
              }
            },
            "items": [
              {
                "id": "r123",
                "title": "Red pill",
                "unit_price": 10000,
                "quantity": 1,
                "tangible": true
              },
              {
                "id": "b123",
                "title": "Blue pill",
                "unit_price": 10000,
                "quantity": 1,
                "tangible": true
              }
            ]
          }))
        .then(transaction => res.send(transaction))
        .catch(e => res.send(e))
});

app.listen(3000);