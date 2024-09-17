import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express()
app.use(bodyParser.json())
app.use(cors())


let usersdb = [
    {
        id: 1,
        name: "Le Fabuleux Destin d'Amelie Poulain",
        year: 2001,
        director: "Jean-Pierre Jeunet",
        duration: 122,
        description: "Amélie Poulain is born in 1974 and brought up by eccentric parents who – incorrectly believing that she has a heart defect – decide to homeschool her. To cope with her loneliness, Amélie develops an active imagination and a mischievous personality. When Amélie is six, her mother, Amandine, is killed when a suicidal Canadian tourist jumps from the roof of Notre-Dame de Paris and lands on her.",
        imgUrl: "https://m.media-amazon.com/images/I/71REhvDWVNL._AC_UF894,1000_QL80_.jpg"
    },
    {
        id: 2,
        name: "The Help",
        year: 2011,
        director: "Tate Taylor",
        duration: 146,
        description: "In 1963, narrator Aibileen Clark is an African-American domestic worker in Jackson, Mississippi, working for socialite Elizabeth Leefolt. She raises Elizabeth’s emotionally neglected two-year-old Mae Mobley. Aibileen's best friend, Minny Jackson, works for Mrs. Walters and her manipulative daughter Hillary 'Hilly' Holbrook, who leads the women's socialite group.",
        imgUrl: "https://pad.mymovies.it/filmclub/2010/03/057/locandina.jpg"
    },
    {
        id: 3,
        name: "Bananas",
        year: 1971,
        director: "Woody Allen",
        duration: 82,
        description: "t a bumbling New Yorker who, after being dumped by his activist girlfriend, travels to a tiny Latin American nation and becomes involved in its latest revolution.",
        imgUrl: "https://pics.filmaffinity.com/Bananas-259829633-large.jpg"
    }
]


app.get('/users', async (req, res) => {

    console.log('GET request to /users')

    console.log("Elems in db: " + usersdb.length)

    res.status(200).json(usersdb)

});

app.put('/users', async (req, res) => {

    console.log('PUT request to /users')
    const userIndex = usersdb.findIndex((user) => { user.id === req.body.id })

    usersdb[userIndex] = req.body;

    console.log("changed film to ", usersdb[userIndex])
    console.log("Elems in db: " + usersdb.length)

    res.status(200).json(usersdb[userIndex])

});



app.delete('/users', async (req, res) => {


    console.log('DELETE request to /users')
    usersdb = usersdb.filter((elem) => elem.id != req.body.id)

    console.log("Elems in db: " + usersdb.length)
    res.status(200).json(req.body)

});





app.listen(80, () => [
    console.log('listening')
]);