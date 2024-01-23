
create env file with REACT_APP_SERVER and REACT_APP_MTGKINGDOMS_CLIENT_ID
For app Id go to https://portal.azure.com/#view/Microsoft_AAD_B2CAdmin/TenantManagementMenuBlade/~/overview using the MTGKingdoms.onmicrosoft.com
 directory, in app registrations you should find the dev and production apps.
 
npm install
npm start

Pushing to master will begin github actions that will deploy to production, use pull requests to attempt changes at master.
