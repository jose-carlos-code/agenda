exports.middlewareGlobal = (req, res, next) => {
  // req.flash('errors', 'ocorreu um erro');
  // res.locals.errors =  'erro genérico';
  // res.locals.success = req.flash('success');
  // req.flash('success', 'requisição aceita com sucesso');
  // res.locals.user = req.session.user;
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if(err) {
    return res.render('404');
    console.log(err);
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  // res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req, res, next) =>{
    if(!req.session.user){
      req.flash('errors', 'você precisa fazer login');
      req.session.save(() => res.redirect('/'));
      return;
    }
    next();
};