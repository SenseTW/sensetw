import * as express from 'express';
import { Context } from '../context';

const api_root = process.env.HYPOTHESIS_API_ROOT;

export function router(context: Context) {
  const router = express.Router();
  router.get('/', (req, res, next) => {
    res.send({
      "message": "Annotator Store API",
      "links": {
        "profile": {
          "read": {
            "url": `${api_root}/profile`,
            "method": "GET",
            "desc": "Fetch the user's profile"
          },
          "update": {
            "url": `${api_root}/profile`,
            "method": "PATCH",
            "desc": "Update a user's preferences"
          }
        },
        "search": {
          "url": `${api_root}/search`,
          "method": "GET",
          "desc": "Search for annotations"
        },
        "group": {
          "member": {
            "delete": {
              "url": `${api_root}/groups/:pubid/members/:user`,
              "method": "DELETE",
              "desc": "Remove the current user from a group."
            }
          }
        },
        "annotation": {
          "hide": {
            "url": `${api_root}/annotations/:id/hide`,
            "method": "PUT",
            "desc": "Hide an annotation as a group moderator."
          },
          "unhide": {
            "url": `${api_root}/annotations/:id/hide`,
            "method": "DELETE",
            "desc": "Unhide an annotation as a group moderator."
          },
          "read": {
            "url": `${api_root}/annotations/:id`,
            "method": "GET",
            "desc": "Fetch an annotation"
          },
          "create": {
            "url": `${api_root}/annotations`,
            "method": "POST",
            "desc": "Create an annotation"
          },
          "update": {
            "url": `${api_root}/annotations/:id`,
            "method": "PATCH",
            "desc": "Update an annotation"
          },
          "flag": {
            "url": `${api_root}/annotations/:id/flag`,
            "method": "PUT",
            "desc": "Flag an annotation for review."
          },
          "delete": {
            "url": `${api_root}/annotations/:id`,
            "method": "DELETE",
            "desc": "Delete an annotation"
          }
        },
        "links": {
          "url": `${api_root}/links`,
          "method": "GET",
          "desc": "URL templates for generating URLs for HTML pages"
        }
      }
    });
  });
  return router;
}
