# Build SenseTW in Google CloudBuild

## Installation
* Setup Cloud Build Trigger with following configuration
    * Tag(reg):
    	* release: v.*
    * cloudbuild.yaml location
    	* release: /builder/cloudbuild/sensemap-release.yaml
    	* staging: /builder/cloudbuild/sensemap-staging.yaml
    * Variable
        * _CLOUDSDK_COMPUTE_ZONE
        * _CLOUDSDK_CONTAINER_CLUSTER
        * _DB_ACCOUNT
        * _DB_PASSWORD
        * _GA_ID
        * _GTM_ID
        * _MAILGUN_HOST
        * _MAILGUN_NAME
        * _MAILGUN_PASS
        * _MAILGUN_PORT
        * _MAILGUN_USER
        * _REDIS_HOST
        * _REDIS_PORT
        * _SESSION_SECRET

## Development
* Setup Environment Variable
    * Sensemap Front (Setup Var in build process)
    	* Edit sensemap-release.yaml and sensemap-staging.yaml
    		* Add/Edit '--build-arg' in First Step (Docker Build process)
    * Sensemap Backend (Setup Var in runtime process)
    	* Change Cloud Build Trigger setup, add/edit Variable
    	* Edit sensemap-release.yaml and sensemap-staging.yaml
    		* Add/Edit 'env' in Fifth Step (gen.sh)
        * Edit /builder/cloudbuild/config/gen.sh
