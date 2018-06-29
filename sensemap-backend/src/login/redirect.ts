
export function loggedIn() {
  return (req, res, next) => {
    if (!!req.user) {
      return res.redirect('/login-success');
    }
    return next();
  };
}

export function notLoggedIn() {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    return next();
  };
}
