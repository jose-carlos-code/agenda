const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: {type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);//retorna uma promise

class Login{
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;        
    }
    
    async register(){//tudo que essa função retorna também é uma promise
        this.valida();
        if(this.errors.length > 0) return;
        //checando se já existe um usuário com esse email
        await this.userExists();
        const salt = bcryptjs.genSaltSync();//cria um salt(um incremento para a criptocrafia)
        this.body.password = bcryptjs.hashSync(this.body.password, salt);//gera o hash com o salt
        try{
            this.user = await LoginModel.create(this.body);

        }catch(e){
            console.log(e);
        }
    }

    async login(){
        this.valida();
        if(this.errors.length > 0){
            return;
        }
        this.user = await LoginModel.findOne({email:this.body.email})
        if(!this.user){
            this.errors.push('Usuário não existe');
            console.log(this.errors);
            return;
        }
        //comparando as senhas
        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Senha inválida')
            return;
        }
    }

    async userExists(){
        //checando se o usuário já está cadastrado
        try{
            this.user = await LoginModel.findOne({email: this.body.email});
            if(this.user){
                this.errors.push('Usuário já existe');
            }
        }catch(e){
            console.log(e);
            return e;
        }
    }

    valida(){
        this.cleanUp();
        //validação  
        //o e-mail precisa ser válido
         if(!validator.isEmail(this.body.email)){
            this.errors.push("E-mail inválido");
         }
        //a senha precisa ter entre 3 e 50 caracteres
        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.errors.push("senha inválida"); 
            console.log('senha inválida');  
        }
    }

    //vai garantir que tudo que estiver dentro do meu body é uma string
    cleanUp(){
        for(const key in this.body){
           if( typeof this.body[key] !== 'string'){
                this.body[key] = '';
           }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;