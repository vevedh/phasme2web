git remote add origin https://github.com/vevedh/phasme-srv.git
git branch -M main
git push -u origin main

docker tag vevedh/phasme-srv:latest vevedh/phasme-srv:latest
docker push vevedh/phasme-srv:latest

# REPO=vevedh/phasme-srv

# before_install

* docker build -f sssd/Dockerfile -t docker-samba-vv-srv/latest sssd/
* docker run -d --name "test-phasme-srv" docker-samba-vv-srv/latest
* docker ps -a

# after_success

* docker login -e vevedh@gmail.com -u vevedh -p $DOCKER_PASS
* docker tag docker-samba-vv-srv/latest vevedh/phasme-srv:latest
* docker push vevedh/phasme-srv:latest


openssl x509 -inform der -in webapps.cer -outform pem -out webapps.pem

docker run -it --rm --add-host "docker-smb1.agglo.local docker-smb1:172.30.151.2" --hostname docker-smb1 -e TZ=America/Martinique -e DOMAIN_NAME=agglo.local -e ADMIN_SERVER=dc11.agglo.local -e WORKGROUP=agglo -e AD_USERNAME=hdechavignyadm -e AD_PASSWORD=d@nZel!77 -p 137:137/udp -p 138:138/udp -p 139:139/tcp -p 443:443/tcp -p 3030:3030/tcp  -v srv:/srv docker-samba-vv-srv/latest

docker run -it --rm --add-host "vvdecha-smb.agglo.local vvdecha-smb:172.30.151.4" --hostname vvdecha-smb -e TZ=America/Martinique -e DOMAIN_NAME=agglo.local -e ADMIN_SERVER=dc11.agglo.local -e WORKGROUP=agglo -e AD_USERNAME=hdechavignyadm -e AD_PASSWORD=d@nZel!77 -e MONGODB_URL=mongodb://admcacem:Cacem972@mongo:27017/cacemdb?authSource=admin -e MONGO_BASENAME=cacemdb -p 137:137/udp -p 138:138/udp -p 139:139/tcp -p 443:443/tcp -p 3030:3030/tcp  -v srv:/srv docker-samba-vv-srv/latest /bin/bash

Enter-PSSession -ComputerName SVRDEVWEB -Authentication Negotiate -Credential $creds

npm install -g node-auth-kerberos

https://github.com/anile/ad_kerberos_auth.git

npm install --save-dev scottylogan/node-ldap-gssapi

## Prepare Active Directory

Add dedicated Kerberos user
You should create a new Active Directory user which is dedicated for Kerberos usage. For further reference, the username of this user $KERBEROS_USER and his password is $KERBEROS_PASSWORD.

## Create keytab file

On the domain controller you have to create a .keytab file:

ktpass -princ HTTP/webserver.test.ad@TEST.AD -mapuser ${KERBEROS_USERNAME}@TEST.AD -pass ${KERBEROS_PASSWORD} -crypto ${ENCRYPTION_TYPE} -ptype KRB5_NT_PRINCIPAL -out C:\Temp\kerberos.keytab
Some notes about this:

${ENCRYPTION_TYPE} can be one of AES256-SHA1, AES128-SHA1, RC4-HMAC-NT, DES-CBC-CRC or DES-CBC-MD5. You should be good to go with AES256-SHA1 but this depends upon your environment.
Please note that the Kerberos principal you are using is case-sensitive. If your keytab entry does not match, please check for differences in upper/lower-case writing.
If you use HTTPS, which we highly recommend, you must use HTTP/webserver.test.ad as principal.
Kerberos authentication is only used when you access http://webserver.test.ad and not http://$IP_OF_WEBSERVER.
To prevent further work and problems, the webserver should be directly accessible and not through a proxy.
Copy the kerberos.keytab file to the webserver's path /etc/kerberos.keytab and change the ownership to this file to the Apache user.

After everything has been configured you can retrieve a valid Kerberos token on the webserver by using

kinit -p Administrator@TEST.AD
Enable Kerberos in Apache
There are two different modules available which provide Kerberos functionality: mod_auth_kerb and mod_auth_gssapi. Even if mod_auth_kerb is much older, please go with it. mod_auth_kerb prints out log messages which you can use for debugging. mod_auth_gssapi does not provide enough useful information during debugging.

To enable Kerberos in your Apache configuration you have to install the module by using apt-get or dnf. After that, open /etc/apache2/sites-available/000-default.conf or any other vhost configuration file you want to use
#<VirtualHost *:443>
#     ServerName $HOSTNAME.${DOMAIN_NAME,,}
#     ServerAlias $HOSTNAME.${DOMAIN_NAME,,}
 
#     SSLEngine on
#     SSLProxyEngine On
#     ProxyRequests Off
 
     SSLCertificateFile /srv/src/your-cert.pem
     SSLCertificateKeyFile /srv/src/your-private-key.pem
     #SSLCertificateChainFile /etc/apache2/ssl/ca.cer
 
     DocumentRoot /var/www/errorPages
 
     ErrorDocument 503 /503.html
     ProxyPass /503.html !
 
     ProxyPass / http://localhost:3030/
     ProxyPassReverse / http://localhost:3030/
 
 
    RewriteEngine on
    RewriteCond %{HTTP:UPGRADE} ^WebSocket$ [NC]
    RewriteCond %{HTTP:CONNECTION} ^Upgrade$ [NC]
    RewriteRule .* ws://localhost:3030%{REQUEST_URI} [P]
 
 
</VirtualHost>
 <VirtualHost *:80>
 
	# ...
	ServerName webserver.test.ad      
	<Location />
		AuthType Kerberos
		AuthName "Kerberos authenticated intranet"
		KrbAuthRealms TEST.AD
		KrbServiceName HTTP/webserver.test.ad
		Krb5Keytab /etc/kerberos.keytab
		KrbMethodNegotiate On
		KrbMethodK5Passwd On
		require valid-user
	</Location>
</VirtualHost>
Configure browsers
You have to configure the browsers you are using.

Debugging
Apache
With

LogLevel trace8
in your Apache configuration you enable a high log level to debug the Kerberos authentication process.

Client credentials
You can use

# Linux
kdestroy -A
# Windows 

 <Location />
                          AuthType Kerberos
                          AuthName "SSO"
                          KrbAuthRealms DOMAIN.LAN
                          KrbServiceName HTTP/server.glpi.domain.fr (* J'ai remplacé le protocole HTTPS par HTTP)
                          Krb5Keytab /etc/kerberos_HTTP.keytab
                          KrbMethodNegotiate On
                          KrbMethodK5Passwd Off (* pour ne plus avoir la fenêtre de sécurité Windows ) 
                          KrbSaveCredentials On
                          require valid-user
                          Order allow,deny (* Couplé avec Allow from et Satisfy Any ) 
                          Allow from 10.53.0.0 (* Accepte uniquement l'authentification des clients situé dans ce range ) 
                          Satisfy Any (* Pour ne pas se prendre l'erreur 401 en pleine figure, et du coup remet la page d'authentification GLPI basique)
                </Location> 

				Configuring SSO in the browser
## Microsoft Internet Explorer
Proceed as follows to configure the Microsoft Internet Explorer:
Open the Microsoft Internet Explorer browser and select Tools > Internet Options > Security tab.
Select Trusted sites and click Sites to display the list of trusted sites.
Add the URL for your Persona-based application to enable auto login and click Close.
Note: If required, select Require server verification (https:) for all sites in this zone.
Click Custom level and navigate to User Authentication > Logon.
Select Automatic logon with current user name and password, and click OK.
Important: Avoid accessing the Persona-based UI using Microsoft Internet Explorer 11 browser with SPNEGO enabled. Though the application appears to work, the browser does not send authentication tokens in the request headers and generates an undesired number of authentication tokens. 

## Mozilla Firefox
Proceed as follows to configure the Mozilla Firefox:
Open the Mozilla Firefox browser.
In the URL field, enter about:config, and press Enter.
Ignore the warning, and click I accept the risk! .
In the Search field, enter network.negotiate-auth.trusted-uris. This preference lists the trusted sites for Kerberos authentication.
Double-click network.negotiate-auth.trusted-uris.
In the Enter string value field, enter the Fully Qualified Domain Name (FQDN) of the host running the InfoSphere® Master Data Management Collaboration Server - Collaborative Edition application, and click OK.

https://active-directory-wp.com/docs/Networking/Single_Sign_On/Configure_browsers_to_use_Kerberos.html

<IfModule mod_ssl.c>
    <VirtualHost _default_:443>
            ServerAdmin admin@foo.bar
            DocumentRoot /var/www/html
            ErrorLog ${APACHE_LOG_DIR}/error.log
            CustomLog ${APACHE_LOG_DIR}/access.log combined

            SSLEngine on
            SSLCertificateFile      /etc/apache2/ssl/cert.pem
            SSLCertificateKeyFile /etc/apache2/ssl/key.pem

            ProxyRequests Off
            ProxyPreserveHost On
            # https://developer.mozilla.org/en-US/docs/Web/HTTP/X-Frame-Options
            Header always append X-Frame-Options SAMEORIGIN


            <Location "/">
                    AuthType Kerberos
                    KrbAuthRealms FOO.BAR
                    Krb5Keytab /etc/apache2/http_mmost01.krb5keytab
                    KrbMethodNegotiate On
                    KrbMethodK5Passwd Off  # set to On for Firefox
                    KrbLocalUserMapping On
                    require valid-user
		# http://httpd.apache.org/docs/2.4/mod/mod_proxy_wstunnel.html
                    ProxyPass ws://localhost:8065/ retry=0
            </Location>
    </VirtualHost>

    Install-Module -Name PSWSMan -Scope AllUsers
Install-WSMan


[libdefaults]
    default_realm = ${DOMAIN_NAME^^}
    kdc_timesync = 1
    ccache_type = 4
    forwardable = true
    proxiable = true
    fcc-mit-ticketflags = true
    default_keytab_name = FILE:/etc/krb5.keytab
    dns_lookup_realm = false
    dns_lookup_kdc = true


    $username = "hdechavignyadm@agglo.local"; $password = ConvertTo-SecureString "d@nZel!77" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password);  Test-WSMan -ComputerName $h -Authentication Negotiate -Credential $usercred
Enter-PSSession -ComputerName svrwebtest.agglo.local -Authentication Negotiate -Credential $usercred
$username = "hdechavignyadm@agglo.local"; $password = ConvertTo-SecureString "d@nZel!77" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password); Invoke-Command -ComputerName svrwebtest.agglo.local -Authentication Negotiate -Credential $usercred -ScriptBlock {Get-HotFix}


$username = "hdechavignyadm@agglo.local"; $password = ConvertTo-SecureString "d@nZel!77" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password); Invoke-Command -ComputerName svrwebtests.agglo.local -Authentication Negotiate -Credential $usercred -ScriptBlock { Import-Module -Name ActiveDirectory ; Get-ADUser -LDAPFilter "(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))"   -Server  "dc12.agglo.local" -property * | select  Name,GivenName,Description,Office,SamAccountName,UserPrincipalName,ThumbnailPhoto,DisplayName,Company,Department,City,HomePhone,mail,OfficePhone,IPPhone,MobilePhone,PostalCode,StreetAddress,co,Surname,Manager,EmployeeNumber,MemberOf,Enabled,CannotChangePassword,PasswordNeverExpires,AccountExpirationDate,whenChanged,whenCreated,LastLogonDate|convertTo-json }



$username = "hdechavignyadm@agglo.local"; $password = ConvertTo-SecureString "d@nZel!77" -AsPlainText -Force; $usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password); Invoke-Command -ComputerName  dc12.agglo.local -Authentication Negotiate -Credential $usercred -ScriptBlock { Get-ADUser -LDAPFilter "(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))"    -property * | select  Name,GivenName,Description,Office,SamAccountName,UserPrincipalName,ThumbnailPhoto,DisplayName,Company,Department,City,HomePhone,mail,OfficePhone,IPPhone,MobilePhone,PostalCode,StreetAddress,co,Surname,Manager,EmployeeNumber,MemberOf,Enabled,CannotChangePassword,PasswordNeverExpires,AccountExpirationDate,whenChanged,whenCreated,LastLogonDate|convertTo-json }


git config --global user.email "vevedh@gmail.com"
git config --global user.name "Hervé de CHAVIGNY"
git config --global user.password "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"

icongenie generate -m pwa -i c:\devs\phasme-srv\client\src\assets\logodsi.png