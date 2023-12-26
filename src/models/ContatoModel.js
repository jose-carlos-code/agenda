const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },    //caso não enviem nada, será armazenado uma string vazia
  sobrenome: {type: String, required: false, default: ''},
  email: {type: String, required: false, default: ''},
  telefone: {type: String, required: false, default: ''},
  criadoEm: {type: Date, required: false, default: Date.now}
});

const contatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body){
  this.body = body;
  this.errors = [];
  this.contato = null;
}

/*COMO ESSA FUNÇÃO VAI ENVIAR COISAS PRO BANCO DE DADOS, ELA PRECISA SER ASYNC*/
Contato.prototype.register = async function(){
  this.valida();
  if(this.errors.length > 0){
    return;
  }
  try{
    this.contato = await contatoModel.create(this.body);
  }catch(error){
    return error;
  }
}

//MÉTODO PARA EDITAR OS DADOS
Contato.prototype.edit = async function(id){
  if(typeof id != 'string'){
    return;
  }
  this.valida();
  if(this.errors.length > 0){
    return;
  }
  try{                                //Encontre o registro pelo ID e faça um update
    this.contato = await contatoModel.findByIdAndUpdate(id, this.body, {new: true});
  }catch(e){
    return e;
  }
}

Contato.prototype.valida = function(){
  this.cleanUp();
  //validação  
  //o e-mail precisa ser válido
   if(this.body.email && !validator.isEmail(this.body.email)){
      this.errors.push("E-mail inválido");
   }

   if(!this.body.nome){
    this.errors.push('"Nome" é um campo requerido!');
   }

   if(!this.body.email && !this.body.nome){
    this.errors.push("Pelo menos um contato precisa ser enviado: e-mail ou telefone");
   }
}

//vai garantir que tudo que estiver dentro do meu body é uma string
Contato.prototype.cleanUp = function(){
  for(const key in this.body){
     if( typeof this.body[key] !== 'string'){
          this.body[key] = '';
     }
  }

  // console.log(contatos); //ta vindo um monte de coisas
  this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone,
      criadoEm: this.body.criadoEm
  };

}

//MÉTODOS ESTÁTICOS -> que não estão no prototype
//função assíncrona para buscar IDs no banco de dados
Contato.buscaId = async function(id){
  if(typeof id != 'string') return;
    const contato = await contatoModel.findById(id);
    return contato;
}

Contato.buscaContatos = async function(){//os contatos virão na ordem que foram criados em ordem decrescente
 const contatos = await contatoModel.find().sort({ criadoEm: -1 });

}
module.exports = Contato; 