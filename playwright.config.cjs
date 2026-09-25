const {defineConfig}=require('@playwright/test');
const {settings}=require('./dev-lab/settings.cjs');
const lab=settings(__dirname,{...process.env,LAB_MODE:'test'});
module.exports=defineConfig({
 testDir:'tests/browser',timeout:60000,workers:1,forbidOnly:!!process.env.CI,
 reporter:[['list'],['html',{open:'never'}]],
 use:{baseURL:lab.origin,headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:{command:'node dev-lab/start.cjs',env:{LAB_MODE:'test'},url:lab.origin+'/__lab/config',reuseExistingServer:false,timeout:180000,gracefulShutdown:{signal:'SIGTERM',timeout:10000}}
});
