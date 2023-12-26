const Contato = require('../models/ContatoModel');
exports.index = (req, res) => {
 res.render('contato', {
  contato: {}
 });
};

exports.register = async (req, res) => {
  const contato = new Contato(req.body);
  try{
    await contato.register();
    if(contato.errors > 0){
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    req.flash('succes','Contato registrado com sucesso');
    let id = (contato.contato._id.toString()).trim();
    req.session.save(() => res.redirect(`/contato/index/${id}`));
    // console.log(`ID DO CONTATO: ${contato.contato._id}`);
    return;
  } catch (error) {
   console.log(error);
   return res.render('404');
  }
};

exports.editIndex = async (req, res) =>{
  let idContato = (req.params.id.toString()).trim();
  try{
    if(!idContato){
      req.flash('errors', 'Contato não encontrado, por favor tente de novo');
      return res.render('404');
    }
    const contato = Contato.buscaId(idContato);
    if(!contato){
      return res.render('404');
    }
    res.render('contato', {contato});
  }catch(e){
    console.log('Contato não encontrado no edit index');
    return res.render('404');
  }
};

//Método de Update
exports.edit = async (req, res) =>{
  if(!req.params.id){
    return res.render('404');
  }
  const contato = new Contato(req.body);
  try {
    await contato.edit(req.params.id.trim());
    if(contato.errors > 0){
      req.flash('errors', contato.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }
    req.flash('succes','Contato registrado com sucesso');
    req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
    return;
  }catch(error) {
    return error;
  }
};