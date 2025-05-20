
create env file with 
REACT_APP_SERVER=localhost:9998
REACT_APP_MTGKINGDOMS_CLIENT_ID=

For app Id go to https://portal.azure.com/#view/Microsoft_AAD_B2CAdmin/TenantManagementMenuBlade/~/overview using the MTGKingdoms.onmicrosoft.com
 directory, in app registrations you should find the dev and production apps.

node 16 might be necessary:
nvm install 16
nvm use 16

npm install
npm start

Pushing to master will begin github actions that will deploy to production, use pull requests to attempt changes at master.
