const LoginModel = require('../models/LoginModel');

exports.index = (req, res) => {
    res.render('login');
};

exports.register = async function(req, resp){
    try {
        const login = new LoginModel(req.body);
        await login.register(); 
        if(login.errors.length > 0){
            req.flash('errors', login.errors);
            console.log(login.errors);
            req.session.save(function(){
                return resp.redirect('back');//redirecionar para a página anterior 
            });
            return;                                                                                                                                                     
        }
        req.flash('success', 'Seu usuário foi criado com sucesso!');
        req.session.save(function(){
            return resp.redirect('back');//redirecionar para a página anterior
        });

    } catch (error) {
        console.log(error);
        return resp.render('404');
    }
};

exports.login = async function(req, resp){

    try {
        const login = new LoginModel(req.body);
        await login.login(); 
        
        if(login.errors.length > 0){
            req.flash('errors', login.errors);
            console.log(login.errors);
            req.session.save(function(){
                return resp.redirect('back');//redirecionar para a página anterior
            });
            return;
        }

        req.flash('success', 'USUÁRIO LOGADO NESSA PORRA!');
        console.log(req.flash('logado'))
        req.session.user = login.user;
        console.log(`A sessão salva foi ${req.session.user}`);
        req.session.save(function(){
            return resp.redirect('back');//redirecionar para a página anterior
        });

    } catch (error) {
        return resp.render('404');
    }
}