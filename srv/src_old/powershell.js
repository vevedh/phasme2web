const logger = require('./logger');
const npwrshell = require('powershell');

module.exports = function (app) {

  const runPowerShell = (cmd) => {
    return new Promise((resolve, reject) => {
    //$username = "admexchange@agglo.local"; $password = ConvertTo-SecureString "FiniLeCl0ud" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password); $session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri http://svrexchg1.agglo.local/PowerShell -Authentication Kerberos -Credential $usercred  -AllowRedirection ;  Invoke-Command -Session $session -scriptblock {${cmd}} |ConvertTo-Json//${cmd}`,
      var psShell = new npwrshell(
        ` $username = "${app.get('authentication').ldap.bindDN}"; $password = ConvertTo-SecureString "${app.get('authentication').ldap.bindCredentials}" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Invoke-Command -ComputerName dc12.agglo.local -Authentication Negotiate -Credential $usercred -scriptblock {  ${cmd} } `,
        {
          executionPolicy: 'Bypass',
          outputEncoding: 'utf-8',
          noProfile: true,
          PSCore: true
        }
      );

      psShell.on('error', (err) => {
        logger.info(err);
        reject(err);
      });

      // Stdout

      psShell.on('output', (data) => {
        //logger.info(data);
        resolve(data);
      });

      // Stderr
      psShell.on('error-output', (data) => {
        logger.info(data);
        reject(data);
      });

      // End
      psShell.on('end', (code) => {
      // Do Something on end
        //logger.info(code);
        psShell = null;
      });
    });
  };
  app.set('pwshCmd', runPowerShell);

};
