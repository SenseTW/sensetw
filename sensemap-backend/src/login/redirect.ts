
export function passLoggedIn() {
  return (req, res, next) => {
    if (!!req.user) {
      if (req.query.next) {
        return res.redirect(req.query.next);
      } else {
        return res.redirect('/login-success');
      }
    }
    return next();
  };
}

export function requireLoggedIn() {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    return next();
  };
}
