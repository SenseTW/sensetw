import * as express from "express";
import { Context } from "../context";

export function router(context: Context) {
  const router = express.Router();
  const { env } = context();
  router.get("/", (req, res, next) => {
    res.send({
      message: "Annotator Store API",
      links: {
        profile: {
          read: {
            url: `${env.HYPOTHESIS_API_ROOT}/profile`,
            method: "GET",
            desc: "Fetch the user's profile"
          },
          update: {
            url: `${env.HYPOTHESIS_API_ROOT}/profile`,
            method: "PATCH",
            desc: "Update a user's preferences"
          }
        },
        search: {
          url: `${env.HYPOTHESIS_API_ROOT}/search`,
          method: "GET",
          desc: "Search for annotations"
        },
        group: {
          member: {
            delete: {
              url: `${env.HYPOTHESIS_API_ROOT}/groups/:pubid/members/:user`,
              method: "DELETE",
              desc: "Remove the current user from a group."
            }
          }
        },
        annotation: {
          hide: {
            url: `${env.HYPOTHESIS_API_ROOT}/annotations/:id/hide`,
            method: "PUT",
            desc: "Hide an annotation as a group moderator."
          },
          unhide: {
            url: `${env.HYPOTHESIS_API_ROOT}/annotations/:id/hide`,
            method: "DELETE",
            desc: "Unhide an annotation as a group moderator."
          },
          read: {
            url: `${env.HYPOTHESIS_API_ROOT}/annotations/:id`,
            method: "GET",
            desc: "Fetch an annotation"
          },
          create: {
            url: `${env.HYPOTHESIS_API_ROOT}/annotations`,
            method: "POST",
            desc: "Create an annotation"
          },
          update: {
            url: `${env.HYPOTHESIS_API_ROOT}/annotations/:id`,
            method: "PATCH",
            desc: "Update an annotation"
          },
          flag: {
            url: `${env.HYPOTHESIS_API_ROOT}/annotations/:id/flag`,
            method: "PUT",
            desc: "Flag an annotation for review."
          },
          delete: {
            url: `${env.HYPOTHESIS_API_ROOT}/annotations/:id`,
            method: "DELETE",
            desc: "Delete an annotation"
          }
        },
        links: {
          url: `${env.HYPOTHESIS_API_ROOT}/links`,
          method: "GET",
          desc: "URL templates for generating URLs for HTML pages"
        }
      }
    });
  });
  return router;
}
