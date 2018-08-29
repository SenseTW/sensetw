import { context } from '../context';

export const bypassAuthenticated = () =>
  (req, res, next) => {
    if (!!req.user) {
      if (req.query.next) {
        return res.redirect(req.query.next);
      } else {
        return res.redirect('/oauth/success');
      }
    }
    return next();
  };

export const requireAuthentication = () =>
  (req, res, next) => {
    const { env } = context({ req });
    if (!req.user) {
      return res.redirect(`/login?next=${encodeURIComponent(env.PUBLIC_URL + req.originalUrl)}`);
    }
    return next();
  };
