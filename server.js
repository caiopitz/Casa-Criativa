
//usei o express para criar e configurar meu servidor

const express = require("express")
const server = express()

const db = require("./db")

 const ideas = [
    {
        img:"https://image.flaticon.com/icons/svg/2729/2729018.svg",
        title: "Curso de programação",
        category:"Estudo",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti iste temporibus sunt.",
        url:"http://rocketseat.com.br"
    },
    {
        img:"https://image.flaticon.com/icons/svg/2729/2729005.svg",
        title: "Exercícios",
        category:"Saúde",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti iste temporibus sunt.",
        url:"http://rocketseat.com.br"
    },
    {
        img:"https://image.flaticon.com/icons/svg/2729/2729027.svg",
        title: "Meditação",
        category:"Mentalidade",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti iste temporibus sunt.",
        url:"http://rocketseat.com.br"
    },
    {
        img:"https://image.flaticon.com/icons/svg/2729/2729032.svg",
        title: "Karaoke",
        category:"Diversão em Família",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti iste temporibus sunt.",
        url:"http://rocketseat.com.br"
    },
    {
        img:"https://www.flaticon.com/premium-icon/icons/svg/2790/2790381.svg",
        title: "Video Game",
        category:"Diversão",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti iste temporibus sunt.",
        url:"http://rocketseat.com.br"
    },
    {
        img:"https://www.flaticon.com/premium-icon/icons/svg/2791/2791226.svg",
        title: "Assisti Televisão",
        category:"Lazer",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti iste temporibus sunt.",
        url:"http://rocketseat.com.br"
    },
]

//configurar arquivos estáticos(css , imagens , scripts)
server.use(express.static("public"))

//habilitar uso do req.body
server.use(express.urlencoded ({extended: true}))
//configuraçao numjucks


const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

//criei um rota /
// e capturo o pedido do cliente para responder
server.get("/", function (req, res){

   
    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados")
         }
        
           const reversedIdeas = [...rows].reverse()

           let lastIdeas = []
           for( let idea of reversedIdeas ) {
               if (lastIdeas.length < 2) {
                   lastIdeas.push(idea)
               }
           }
       
           
           return res.render("index.html", {ideas: lastIdeas});
                       
        })
        
           
  
})

server.get("/ideias", function (req, res){

    db.all(`SELECT * FROM ideas`, function(err, rows){
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados")
            
        }
        const reversedIdeas = [...rows].reverse()

        return res.render("ideias.html",{ideas: reversedIdeas})

    })



    
  
})

server.post("/", function(req , res){
    // inserir dados na tabela
    const query=`
        INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
        ) VALUES (?,?,?,?,?);
        `

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]
       
      

      db.run(query, values, function(err) {
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados")
        }      

        return res.redirect("/ideias")
   })
})

// Liguei meu servidor na porta 3000
server.listen(3000)