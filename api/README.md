# node-mongo-signup-verification-api

NodeJS + MongoDB - API with Email Sign Up, Verification, Authentication & Forgot Password

For documentation and instructions see https://jasonwatmore.com/post/2020/05/13/node-mongo-api-with-email-sign-up-verification-authentication-forgot-password

### Change default branch from main to dev
git branch -m main dev
git fetch origin
git branch -u origin/dev dev
git remote set-head origin -a

### If you have remote-tracking branches set up locally, it's as simple as:

git checkout staging
git merge dev
git push origin staging

### If you have not yet set up remote-tracking branches, you could do something like:

git fetch origin
git checkout staging     # or `git checkout -b production origin/production` if you haven't set up production branch locally
git merge origin/dev
git push origin staging