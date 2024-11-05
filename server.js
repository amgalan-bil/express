const express = require("express")
const fs = require("fs")
const app = express()
const data = require("./data.json")

app.use(express.json())
const PORT = 3000;

app.get("/users/id=3", (req, res)=>{
    const url = req.url;
    const id = url.split("=")[1];
    const filter = data.filter((item)=>{
        return item.id === id;
    })

    if(filter.length){
        res.send(filter);
        res.end();
    }else{
        res.send({message:"not found"})
        res.end();
    }

    res.send({message: "sent"})
})


app.get("/users", (req, res)=>{
    res.send(data);
})

const checkRequirement = (req, res, next) =>{
    
    const name = req.body.name
    const password = req.body.password
    console.log(password)
    const filter = data.filter((ner)=>{
        return ner.name === name;
    })

    const passFilter = data.filter((pass)=>{
        return pass.password === password;
    })

    console.log(passFilter)
    
    if(req.body.age < 18){
        res.send({message: "age is wrong"})
    }else if(!filter.length){
        res.send({message: "Name is wrong"})
    }else if (!passFilter.length){
        res.send({message: "password is wrong"})
    }

    next()
}

app.post("/login", checkRequirement ,(req, res)=>{
    res.send({message: "login successful"})
})

app.post("/signup", (req, res)=>{
    const body = req.body
    const name = body.name
    const id = body.id
    const age = body.age

    const checkData = data.filter((item)=>{
        return item.id && item.name === name && id
    })

    if(!checkData.length){
        data.push(body)
        res.send({message: "signup success"})
        fs.writeFileSync("data.json", JSON.stringify(data), (err)=>{
            console.log(err)
        })
        res.end()
    }else if(age < 18){
        res.send({message: "too young"})
    }else{
        res.send({message:"signup fail"})
    }
    
})


app.listen(PORT, console.log(`App running at port ${PORT}`))