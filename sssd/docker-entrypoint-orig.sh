#!/bin/bash
# Reference:
# * https://wiki.debian.org/AuthenticatingLinuxWithActiveDirectory
# * https://wiki.samba.org/index.php/Troubleshooting_Samba_Domain_Members
# * http://www.oreilly.com/openbook/samba/book/ch04_08.html

#set -e

GUEST_USERNAME=${GUEST_USERNAME:-hdechavigny}
GUEST_PASSWORD=${GUEST_PASSWORD:-testpass}

MONGO_BASENAME=${MONGO_BASENAME:-testdb}
MONGODB_URL=${MONGODB_URL:-mongodb://mongo:27017}

SMTP_SERVER=${SMTP_SERVER:-mail.domain.fr}
SMTP_PORT=${SMTP_PORT:-587}
SMTP_SECURE=${SMTP_SECURE:-false}
SMTP_USER=${SMTP_USER:-notification@domain.fr}
SMTP_PASS=${SMTP_PASS:-mailpassword}

ADM_MAIL=${ADM_MAIL:-admin@domain.fr}

TZ=${TZ:-Etc/UTC}
# Update loopback entry
AD_USERNAME=${AD_USERNAME:-administrator}
AD_PASSWORD=${AD_PASSWORD:-password}
HOSTNAME=${HOSTNAME:-$(hostname)}
IP_ADDRESS=${IP_ADDRESS:-}
DOMAIN_NAME=${DOMAIN_NAME:-domain.loc}
ADMIN_SERVER=${ADMIN_SERVER:-${DOMAIN_NAME,,}}
KDC_SERVER=${KDC_SERVER:-$(echo ${ADMIN_SERVER,,} | awk '{print $1}')}
PASSWORD_SERVER=${PASSWORD_SERVER:-${ADMIN_SERVER,,}}

ENCRYPTION_TYPES=${ENCRYPTION_TYPES:-rc4-hmac des3-hmac-sha1 des-cbc-crc arcfour-hmac aes256-cts-hmac-sha1-96 aes128-cts-hmac-sha1-96 des-cbc-md5}

NAME_RESOLVE_ORDER=${NAME_RESOLVE_ORDER:-host bcast}

SERVER_STRING=${SERVER_STRING:-Samba Server Version %v}
SECURITY=${SECURITY:-ads}
REALM=${REALM:-${DOMAIN_NAME^^}}
PASSWORD_SERVER=${PASSWORD_SERVER:-${DOMAIN_NAME,,}}
WORKGROUP=${WORKGROUP:-${DOMAIN_NAME^^}}
WINBIND_SEPARATOR=${WINBIND_SEPARATOR:-"\\"}
WINBIND_UID=${WINBIND_UID:-50-9999999999}
WINBIND_GID=${WINBIND_GID:-50-9999999999}
WINBIND_ENUM_USERS=${WINBIND_ENUM_USERS:-yes}
WINBIND_ENUM_GROUPS=${WINBIND_ENUM_GROUPS:-yes}
TEMPLATE_HOMEDIR=${TEMPLATE_HOMEDIR:-/home/%D/%U}
TEMPLATE_SHELL=${TEMPLATE_SHELL:-/bin/bash}
CLIENT_USE_SPNEGO=${CLIENT_USE_SPNEGO:-yes}
CLIENT_NTLMV2_AUTH=${CLIENT_NTLMV2_AUTH:-yes}
ENCRYPT_PASSWORDS=${ENCRYPT_PASSWORDS:-yes}
SERVER_SIGNING=${SERVER_SIGNING:-auto}
SMB_ENCRYPT=${SMB_ENCRYPT:-auto}
WINDBIND_USE_DEFAULT_DOMAIN=${WINBIND_USE_DEFAULT_DOMAIN:-yes}
RESTRICT_ANONYMOUS=${RESTRICT_ANONYMOUS:-2}
DOMAIN_MASTER=${DOMAIN_MASTER:-no}
LOCAL_MASTER=${LOCAL_MASTER:-no}
PREFERRED_MASTER=${PREFERRED_MASTER:-no}
OS_LEVEL=${OS_LEVEL:-0}
WINS_SUPPORT=${WINS_SUPPORT:-no}
WINS_SERVER=${WINS_SERVER:-127.0.0.1}
DNS_PROXY=${DNS_PROXY:-no}
LOG_LEVEL=${LOG_LEVEL:-1}
DEBUG_TIMESTAMP=${DEBUG_TIMESTAMP:-yes}
LOG_FILE=${LOG_FILE:-/var/log/samba/log.%m}
MAX_LOG_SIZE=${MAX_LOG_SIZE:-1000}
#Deprecated: SYSLOG_ONLY=${SYSLOG_ONLY:-no}
#Deprecated: SYSLOG=${SYSLOG:-0}
PANIC_ACTION=${PANIC_ACTION:-/usr/share/samba/panic-action %d}
HOSTS_ALLOW=${HOSTS_ALLOW:-*}
SOCKET_OPTIONS=${SOCKET_OPTIONS:-TCP_NODELAY SO_KEEPALIVE IPTOS_LOWDELAY}
READ_RAW=${READ_RAW:-yes}
WRITE_RAW=${WRITE_RAW:-yes}
OPLOCKS=${OPLOCKS:-no}
LEVEL2_OPLOCKS=${LEVEL2_OPLOCKS:-no}
KERNEL_OPLOCKS=${KERNEL_OPLOCKS:-yes}
MAX_XMIT=${MAX_XMIT:-65535}
DEAD_TIME=${DEAD_TIME:-15}
DC_IPADDRESS=${DC_IPADDRESS}

SAMBA_CONF=/etc/samba/smb.conf

echo --------------------------------------------------
echo "Change le /etc/resolv.conf"
echo --------------------------------------------------
cat > /etc/reolv.conf <<EOF
domain ${DOMAIN_NAME^^,,}
search ${DOMAIN_NAME^^,,}
nameserver ${DC_IPADDRESS}
EOF

echo --------------------------------------------------
echo "Backing up current smb.conf"
echo --------------------------------------------------
if [[ ! -f /etc/samba/smb.conf.original ]]; then
	mv -v /etc/samba/smb.conf /etc/samba/smb.conf.original
	touch $SAMBA_CONF
fi

echo --------------------------------------------------
echo "Setting Timezone configuration"
echo --------------------------------------------------
echo $TZ | tee /etc/timezone
dpkg-reconfigure --frontend noninteractive tzdata

echo --------------------------------------------------
echo "Setting up Kerberos realm: \"${DOMAIN_NAME^^}\""
echo --------------------------------------------------
if [[ ! -f /etc/krb5.conf.original ]]; then
	mv /etc/krb5.conf /etc/krb5.conf.original
fi

cat > /etc/krb5.conf << EOL
[logging]
    default = FILE:/var/log/krb5.log 
    kdc = FILE:/var/log/kdc.log 
    admin_server = FILE:/var/log/kadmind.log

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

[realms]
    ${DOMAIN_NAME^^} = {
        kdc = $(echo ${ADMIN_SERVER,,} | awk '{print $1}')
        admin_server = $(echo ${ADMIN_SERVER,,} | awk '{print $1}')
        default_domain = ${DOMAIN_NAME^^}       
    }
    ${DOMAIN_NAME,,} = {
        kdc = $(echo ${ADMIN_SERVER,,} | awk '{print $1}')
        admin_server = $(echo ${ADMIN_SERVER,,} | awk '{print $1}')
        default_domain = ${DOMAIN_NAME,,}
    }
    ${WORKGROUP^^} = {
        kdc = $(echo ${ADMIN_SERVER,,} | awk '{print $1}')
        admin_server = $(echo ${ADMIN_SERVER,,} | awk '{print $1}')
        default_domain = ${DOMAIN_NAME^^}       
    }
    
[domain_realm]
    .${DOMAIN_NAME,,} = ${DOMAIN_NAME^^}
    ${DOMAIN_NAME,,} = ${DOMAIN_NAME^^}
EOL

echo --------------------------------------------------
echo "Setting up guest user credential: \"$GUEST_USERNAME\""
echo --------------------------------------------------
if [[ ! `grep $GUEST_USERNAME /etc/passwd` ]]; then
    useradd $GUEST_USERNAME
fi
echo $GUEST_PASSWORD | tee - | smbpasswd -a -s $GUEST_USERNAME


echo --------------------------------------------------
echo " Starting system message bus"
echo --------------------------------------------------
/etc/init.d/dbus start


echo --------------------------------------------------
echo "Discovering domain specifications"
echo --------------------------------------------------
# realm discover -v ${DOMAIN_NAME,,}
realm discover -v $(echo $ADMIN_SERVER | awk '{print $1}')

echo --------------------------------------------------
echo "Joining domain: \"${DOMAIN_NAME,,}\""
echo --------------------------------------------------
#echo $AD_PASSWORD | /usr/sbin/adcli join --verbose --domain ${DOMAIN_NAME,,} --domain-realm ${DOMAIN_NAME^^} --domain-controller $(echo ${ADMIN_SERVER,,} | awk '{print $1}') --login-type user --login-user $AD_USERNAME --stdin-password
#echo $AD_PASSWORD | realm join -v ${DOMAIN_NAME,,} --user=$AD_USERNAME
printf $AD_PASSWORD | realm join -v $(echo ${ADMIN_SERVER,,} | awk '{print $1}') --user=$AD_USERNAME
#echo $AD_PASSWORD | realm join --user="${DOMAIN_NAME^^}\\$AD_USERNAME" $(echo $ADMIN_SERVER | awk '{print $1}')

# Restrict Domain controllers to join as per ADMIN_SERVER environment variable
#crudini --set /etc/sssd/sssd.conf "domain/${DOMAIN_NAME^^}" "ad_server" "$(echo ${ADMIN_SERVER} | sed 's#\s#,#g')"
#crudini --set /etc/sssd/sssd.conf "domain/${DOMAIN_NAME^^}" "ldap_id_mapping" "True"
cat /etc/sssd/sssd.conf

echo --------------------------------------------------
echo "Starting: \"sssd\""
echo --------------------------------------------------
timeout 30s /etc/init.d/sssd restart
timeout 30s /etc/init.d/sssd status



echo --------------------------------------------------
echo "Activating home directory auto-creation"
echo --------------------------------------------------
echo "session required pam_mkhomedir.so skel=/etc/skel/ umask=0022" | tee -a /etc/pam.d/common-session

echo --------------------------------------------------
echo "Generating Samba configuration: \"$SAMBA_CONF\""
echo --------------------------------------------------

crudini --set $SAMBA_CONF global "vfs objects" "acl_xattr"
crudini --set $SAMBA_CONF global "map acl inherit" "yes"
crudini --set $SAMBA_CONF global "store dos attributes" "yes"
crudini --set $SAMBA_CONF global "guest account" "$GUEST_USERNAME"

crudini --set $SAMBA_CONF global "workgroup" "$WORKGROUP"
crudini --set $SAMBA_CONF global "server string" "$SERVER_STRING"

# Add the IPs / subnets allowed acces to the server in general.
crudini --set $SAMBA_CONF global "hosts allow" "$HOSTS_ALLOW"

# log files split per-machine.
crudini --set $SAMBA_CONF global "log file" "$LOG_FILE"

# Enable debug
crudini --set $SAMBA_CONF global "log level" "$LOG_LEVEL"

# Maximum size per log file, then rotate.
crudini --set $SAMBA_CONF global "max log size" "$MAX_LOG_SIZE"

# Active Directory
crudini --set $SAMBA_CONF global "security" "$SECURITY"
crudini --set $SAMBA_CONF global "encrypt passwords" "$ENCRYPT_PASSWORDS"
crudini --set $SAMBA_CONF global "passdb backend" "tdbsam"
crudini --set $SAMBA_CONF global "realm" "$REALM"
crudini --set $SAMBA_CONF global "kerberos method" "secrets and keytab"

# Disable Printers.
crudini --set $SAMBA_CONF global "printcap name" "/dev/null"
crudini --set $SAMBA_CONF global "panic action" "no"
crudini --set $SAMBA_CONF global "cups options" "raw"

# Name resolution order
crudini --set $SAMBA_CONF global "name resolve order" "$NAME_RESOLVE_ORDER"

# Performance Tuning
crudini --set $SAMBA_CONF global "socket options" "$SOCKET_OPTIONS"
crudini --set $SAMBA_CONF global "read raw" "$READ_RAW"
crudini --set $SAMBA_CONF global "write raw" "$WRITE_RAW"
crudini --set $SAMBA_CONF global "oplocks" "$OPLOCKS"
crudini --set $SAMBA_CONF global "level2 oplocks" "$LEVEL2_OPLOCKS"
crudini --set $SAMBA_CONF global "kernel oplocks" "$KERNEL_OPLOCKS"
crudini --set $SAMBA_CONF global "max xmit" "$MAX_XMIT"
crudini --set $SAMBA_CONF global "dead time" "$DEAD_TIME"

# Point to specific kerberos server
crudini --set $SAMBA_CONF global "password server" "$PASSWORD_SERVER"

# #crudini --set $SAMBA_CONF global "winbind separator" "$WINBIND_SEPARATOR"
crudini --set $SAMBA_CONF global "winbind uid" "$WINBIND_UID"
crudini --set $SAMBA_CONF global "winbind gid" "$WINBIND_GID"
crudini --set $SAMBA_CONF global "winbind use default domain" "$WINDBIND_USE_DEFAULT_DOMAIN"
crudini --set $SAMBA_CONF global "winbind enum users" "$WINBIND_ENUM_USERS"
crudini --set $SAMBA_CONF global "winbind enum groups" "$WINBIND_ENUM_GROUPS"
crudini --set $SAMBA_CONF global "template homedir" "$TEMPLATE_HOMEDIR"
crudini --set $SAMBA_CONF global "template shell" "$TEMPLATE_SHELL"
#crudini --set $SAMBA_CONF global "client use spnego" "$CLIENT_USE_SPNEGO"
#crudini --set $SAMBA_CONF global "client ntlmv2 auth" "$CLIENT_NTLMV2_AUTH"
#crudini --set $SAMBA_CONF global "encrypt passwords" "$ENCRYPT_PASSWORDS"
crudini --set $SAMBA_CONF global "server signing" "$SERVER_SIGNING"
crudini --set $SAMBA_CONF global "smb encrypt" "$SMB_ENCRYPT"
crudini --set $SAMBA_CONF global "restrict anonymous" "$RESTRICT_ANONYMOUS"
crudini --set $SAMBA_CONF global "domain master" "$DOMAIN_MASTER"
crudini --set $SAMBA_CONF global "local master" "$LOCAL_MASTER"
crudini --set $SAMBA_CONF global "preferred master" "$PREFERRED_MASTER"
crudini --set $SAMBA_CONF global "os level" "$OS_LEVEL"
crudini --set $SAMBA_CONF global "ldap admin dn" "$(echo ${DOMAIN_NAME^^} | awk -F'.' '{ print "DC="$1",DC="$2 }')"
# crudini --set $SAMBA_CONF global "wins support" "$WINS_SUPPORT"
# crudini --set $SAMBA_CONF global "wins server" "$WINS_SERVER"
crudini --set $SAMBA_CONF global "dns proxy" "$DNS_PROXY"
crudini --set $SAMBA_CONF global "log level" "$LOG_LEVEL"
crudini --set $SAMBA_CONF global "debug timestamp" "$DEBUG_TIMESTAMP"
crudini --set $SAMBA_CONF global "log file" "$LOG_FILE"
crudini --set $SAMBA_CONF global "max log size" "$MAX_LOG_SIZE"
# crudini --set $SAMBA_CONF global "syslog only" "$SYSLOG_ONLY"
# crudini --set $SAMBA_CONF global "syslog" "$SYSLOG"
# crudini --set $SAMBA_CONF global "panic action" "$PANIC_ACTION"
# crudini --set $SAMBA_CONF global "hosts allow" "$HOSTS_ALLOW"

# Inherit groups in groups
crudini --set $SAMBA_CONF global "winbind nested groups" "no"
crudini --set $SAMBA_CONF global "winbind refresh tickets" "yes"
crudini --set $SAMBA_CONF global "winbind offline logon" "true"
crudini --set $SAMBA_CONF global "server role" "standalone server"
crudini --set $SAMBA_CONF global "map to guest" "bad user"
crudini --set $SAMBA_CONF global "usershare allow guests" "yes"
crudini --set $SAMBA_CONF global "kerberos method" "secrets and keytab"

# home shared directory (restricted to owner)
crudini --set $SAMBA_CONF home "comment" "Home Directories"
crudini --set $SAMBA_CONF home "path" "/home/"
crudini --set $SAMBA_CONF home "public" "yes"
crudini --set $SAMBA_CONF home "guest ok" "yes"
crudini --set $SAMBA_CONF home "read only" "yes"
crudini --set $SAMBA_CONF home "writeable" "yes"
crudini --set $SAMBA_CONF home "create mask" "0777"
crudini --set $SAMBA_CONF home "directory mask" "0777"
crudini --set $SAMBA_CONF home "browseable" "yes"
crudini --set $SAMBA_CONF home "printable" "no"
crudini --set $SAMBA_CONF home "oplocks" "yes"

#crudini --set $SAMBA_CONF home "valid users" "%S"

# public shared directory (unrestricted)
mkdir -p "/usr/share/public"
crudini --set $SAMBA_CONF public "comment" "Public Directories"
crudini --set $SAMBA_CONF public "path" "/usr/share/public/"
crudini --set $SAMBA_CONF public "public" "yes"
crudini --set $SAMBA_CONF public "guest ok" "no"
crudini --set $SAMBA_CONF public "read only" "no"
crudini --set $SAMBA_CONF public "writeable" "yes"
crudini --set $SAMBA_CONF public "create mask" "0774"
crudini --set $SAMBA_CONF public "directory mask" "0774"
crudini --set $SAMBA_CONF public "browseable" "yes"
crudini --set $SAMBA_CONF public "printable" "no"
crudini --set $SAMBA_CONF public "oplocks" "yes"

# private shared directory (restricted)
mkdir -p "/usr/share/private"
crudini --set $SAMBA_CONF private "comment" "Private Directories"
crudini --set $SAMBA_CONF private "path" "/usr/share/private/"
crudini --set $SAMBA_CONF private "public" "yes"
crudini --set $SAMBA_CONF private "guest ok" "no"
crudini --set $SAMBA_CONF private "read only" "no"
crudini --set $SAMBA_CONF private "writeable" "yes"
crudini --set $SAMBA_CONF private "create mask" "0774"
crudini --set $SAMBA_CONF private "directory mask" "0774"
crudini --set $SAMBA_CONF private "browseable" "yes"
crudini --set $SAMBA_CONF private "printable" "no"
crudini --set $SAMBA_CONF private "oplocks" "yes"

echo --------------------------------------------------
echo "Updating NSSwitch configuration: \"/etc/nsswitch.conf\""
echo --------------------------------------------------
if [[ ! `grep "winbind" /etc/nsswitch.conf` ]]; then
    echo "Updating NSSwitch..."
    sed -i "s#^\(passwd\:\s*compat\)\s*\(.*\)\$#\1 \2 winbind#" /etc/nsswitch.conf
    sed -i "s#^\(group\:\s*compat\)\s*\(.*\)\$#\1 \2 winbind#" /etc/nsswitch.conf
    sed -i "s#^\(shadow\:\s*compat\)\s*\(.*\)\$#\1 \2 winbind#" /etc/nsswitch.conf
fi

pam-auth-update

echo ---------------------------------------------------------------------
echo 'Registering credential in /etc/krb5.keytab' for HTTP and HTTPS
echo -----------------------------------------------------------------------
echo "$AD_PASSWORD" | net ads keytab add HTTP -U "$AD_USERNAME@${DOMAIN_NAME^^}"
echo "$AD_PASSWORD" | net ads keytab add HTTPS -U "$AD_USERNAME@${DOMAIN_NAME^^}"

echo --------------------------------------------------
echo 'Generating Kerberos ticket'
echo --------------------------------------------------
echo $AD_PASSWORD | kinit -V $AD_USERNAME@$REALM

echo --------------------------------------------------
echo 'Registering to Active Directory'
echo --------------------------------------------------
net ads join -U"$AD_USERNAME"%"$AD_PASSWORD"  -S "$ADMIN_SERVER"
#wbinfo --online-status

smbpasswd -a -s $GUEST_USERNAME -w $GUEST_PASSWORD


echo -------------------------------------------------
echo 'Fix DNS Record A '
echo -------------------------------------------------
/usr/bin/pwsh -f /opt/pwrshell/AddDnsRecordA.ps1 -Username "$AD_USERNAME" -Pass "$AD_PASSWORD" -Dc "$ADMIN_SERVER" -Computer "$HOSTNAME" -Ip "$IP_ADDRESS" -Domain "$DOMAIN_NAME"

echo -------------------------------------------------
echo -n "PHP VERSION : $(/usr/bin/php -v)"
echo -------------------------------------------------
echo -------------------------------------------------
echo -n "PHPMODULES : $(/usr/bin/php -m)"
echo -------------------------------------------------

echo --------------------------------------------------
echo 'Configuration de composer'
echo --------------------------------------------------
/usr/bin/php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
HASH="$(wget -q -O - https://composer.github.io/installer.sig)"
/usr/bin/php -r "if (hash_file('SHA384', 'composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
/usr/bin/php composer-setup.php --install-dir=/usr/local/bin --filename=composer


if [[ -f `/srv/src/$HOSTNAME.${DOMAIN_NAME,,}.pem` ]] && [[ -f `/srv/src/$HOSTNAME.${DOMAIN_NAME,,}-key.pem` ]]; then
echo --------------------------------------------------
echo 'Configure apache2 http+ssl / nodejs redirect ...'
echo --------------------------------------------------
a2enmod ssl proxy proxy_http proxy_wstunnel headers rewrite auth_kerb
echo "ServerName $HOSTNAME.${DOMAIN_NAME,,}" >> /etc/apache2/apache2.conf
cat > /etc/apache2/sites-available/${HOSTNAME}.${DOMAIN_NAME,,}.conf <<EOL
<VirtualHost *:80>
        ServerName $HOSTNAME.${DOMAIN_NAME,,}
        ProxyPreserveHost On
        ProxyRequests Off

        <Location />
                ProxyPass http://localhost:3030/
                ProxyPassReverse http://localhost:3030/
                Order allow,deny
                Allow from all

                AuthType GSSAPI 
                AuthName "Kerberos Authentication"
                GssapiBasicAuth On 
                GssapiLocalName On 
                GssapiCredStore keytab:/etc/krb5.keytab
                require valid-user
        </Location>
       

        ServerAdmin ${ADM_MAIL,,}
       

        ErrorLog ${APACHE_LOG_DIR}/$HOSTNAME.${DOMAIN_NAME,,}-error.log
        CustomLog ${APACHE_LOG_DIR}/$HOSTNAME.${DOMAIN_NAME,,}-access.log combined

        #RewriteEngine on
        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf
</VirtualHost>

<VirtualHost *:443>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.
        ServerName $HOSTNAME.${DOMAIN_NAME,,}

        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn

        ErrorLog ${APACHE_LOG_DIR}/$HOSTNAME.${DOMAIN_NAME,,}-error.log
        CustomLog ${APACHE_LOG_DIR}/$HOSTNAME.${DOMAIN_NAME,,}-access.log combined

        #RewriteEngine on
        SSLEngine on
        #SSLOptions +StrictRequire
        SSLProtocol all
        #SSLCipherSuite HIGH

        # certificats
        SSLCertificateFile /srv/src/$HOSTNAME.${DOMAIN_NAME,,}.pem
        SSLCertificateKeyFile /srv/src/$HOSTNAME.${DOMAIN_NAME,,}-key.pem
        #SSLCertificateChainFile /etc/letsencrypt/live/$HOSTNAME.${DOMAIN_NAME,,}/chain.pem


        <Location />
                ProxyPass http://localhost:3030/
                ProxyPassReverse http://localhost:3030/

                #AuthType Kerberos
                #AuthName "Kerberos Login"
                #KrbServiceName HTTP/$HOSTNAME.${DOMAIN_NAME,,}
                #KrbMethodNegotiate On
                #KrbAuthoritative On
                #KrbMethodK5Passwd On
                #KrbSaveCredentials Off
                #KrbVerifyKDC off
                #KrbServiceName Any
                #KrbAuthRealms $REALM
                #Krb5KeyTab /etc/krb5.keytab
                #require valid-user

                AuthType GSSAPI 
                AuthName "Kerberos Authentication"
                GssapiBasicAuth On 
                GssapiLocalName On 
                GssapiCredStore keytab:/etc/krb5.keytab
                require valid-user



                Order allow,deny
                Allow from all
        </Location>



        RewriteEngine On
        RewriteCond %{HTTP:CONNECTION} Upgrade [NC]
        RewriteCond %{HTTP:Upgrade} =websocket [NC]
        RewriteRule /(.*)           ws://localhost:3030/\$1 [P,L]
        RewriteCond %{HTTP:Upgrade} !=websocket [NC]
        RewriteRule /(.*)           http://localhost:3030/\$1 [P,L]

        ProxyPassReverse /          http://localhost:3030/


</VirtualHost>
EOL

/usr/sbin/a2ensite ${HOSTNAME}.${DOMAIN_NAME,,}
/usr/sbin/service apache2 restart

fi


#if [[ -f /opts/srv/000-default.conf ]]; then

#cp -f /opts/srv/000-default.conf /etc/apache2/sites-available/000-default.conf

#cat > /srv/index.php <<'EOL'
#<?php
#echo "<h2>Kerberos Auth</h2>";
#echo "Auth type: " . $_SERVER['AUTH_TYPE'] . "<br />";
#echo "Remote user: " . $_SERVER['REMOTE_USER'] . "<br />";
#?>
#EOL

#/usr/sbin/a2ensite 000-default.conf
#/usr/sbin/service apache2 restart
#fi


/bin/chown root:www-data /etc/krb5.keytab
/bin/chmod 640 /etc/krb5.keytab
#/bin/chgrp www-data /etc/krb5.keytab
#/bin/mkdir -p /var/www/sso
#/bin/chown www-data:www-data /var/www/sso

if [[ -d /srv ]]; then
echo --------------------------------------------------------
echo 'Fichier de demande de certificat valid csr_details.txt'
echo --------------------------------------------------------
cat > /srv/csr_details.txt <<-EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn

[ dn ]
C=MQ
ST=Martinique
L=LAMENTIN
O=${DOMAIN_NAME^^}
OU=DSI
emailAddress=${ADM_MAIL,,}
CN = $HOSTNAME.${DOMAIN_NAME,,}

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = $HOSTNAME.${DOMAIN_NAME,,}
IP.1 = $IP_ADDRESS
EOF
echo --------------------------------------------------------
echo "Fichiers de cle privé ${HOSTNAME}.key "
echo --------------------------------------------------------
echo --------------------------------------------------------
echo "Fichiers de CSR ${HOSTNAME}.csr "
echo --------------------------------------------------------
openssl req -nodes -newkey rsa:2048 -sha256 -days 3650 -keyout ${HOSTNAME}.key -out ${HOSTNAME}.csr -config <(cat /srv/csr_details.txt)
echo --------------------------------------------------------
echo "Fichiers de cle privé ${HOSTNAME}.key crée "
echo --------------------------------------------------------
echo --------------------------------------------------------
echo "Fichiers de CSR ${HOSTNAME}.csr crée "
echo --------------------------------------------------------
fi
#if [[ -d /srv/certs ]]; then

#echo ----------------------------------------------------
#echo 'Create Locally Trusted SSL Certificates with mkcert'
#echo -----------------------------------------------------
#cd /srv/certs
#rm -rf /srv/certs/*
#wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
#cp mkcert-v1.4.3-linux-amd64 /usr/local/bin/mkcert
#chmod +x /usr/local/bin/mkcert
#mkcert -install
#mkcert -CAROOT
#mkcert ${HOSTNAME}.${DOMAIN_NAME,,} *.${DOMAIN_NAME,,} localhost 127.0.0.1 $IP_ADDRESS ::1
#cp -f ${HOSTNAME}.${DOMAIN_NAME,,}??-key.pem /srv/src/${HOSTNAME}.${DOMAIN_NAME,,}-key.pem
#cp -f ${HOSTNAME}.${DOMAIN_NAME,,}??.pem /srv/src/${HOSTNAME}.${DOMAIN_NAME,,}.pem
#fi

#cat > /var/www/sso/index.php <<'EOL'
#<?php
#echo "<h2>Kerberos Auth</h2>";
#echo "Auth type: " . $_SERVER['AUTH_TYPE'] . "<br />";
#echo "Remote user: " . $_SERVER['REMOTE_USER'] . "<br />";
#?>
#EOL






#echo --------------------------------------------------
#echo " Change resolv.conf"
#echo --------------------------------------------------
#cat > /etc/resolv.conf <<EOF
#search ${DOMAIN_NAME,,}
#nameserver ${ADMIN_SERVER}
#EOF

#echo --------------------------------------------------
#echo " Change resolv.conf"
#echo --------------------------------------------------
#cat > /etc/hosts <<EOF
#127.0.0.1       localhost
#::1     localhost ip6-localhost ip6-loopback
#fe00::0 ip6-localnet
#ff00::0 ip6-mcastprefix
#ff02::1 ip6-allnodes
#ff02::2 ip6-allrouters
#${IP_ADDRESS}    $HOSTNAME.${DOMAIN_NAME,,} $HOSTNAME
#${IP_ADDRESS}    $HOSTNAME
#EOF


echo --------------------------------------------------
echo 'Status Samba to enable handling by supervisord'
echo --------------------------------------------------
/etc/init.d/winbind stop
/etc/init.d/nmbd stop
/etc/init.d/smbd stop



if [[ -d /srv ]] && [[  -f /srv/package.json ]]; then
echo -------------------------------------------------------
echo 'Demarrage de application nodejs /srv ecoute port 3030'
echo -------------------------------------------------------
if [[  -f /srv/package.json ]]; then
cat > /srv/config/default.json <<EOL
{
  "host": "localhost",
  "port": "3030",
  "public": "../www",
  "adminfolder": "../www/",
  "prj_folder": "../projets",
  "admGroups": [
    "Utilisateurs DSI"
  ],
  "mailTransport": {
    "host": "${SMTP_SERVER,,}",
    "port": ${SMTP_PORT},
    "secure": ${SMTP_SECURE},
    "auth": {
      "user": "${SMTP_USER}",
      "pass": "${SMTP_PASS}"
    },
    "tls": {
      "ciphers": "SSLv3"
    }
  },
  "paginate": {
    "default": 10,
    "max": 50
  },
  "kerberos":{
    "service":"HTTP@$HOSTNAME.${DOMAIN_NAME,,}",
    "fqdn":"$HOSTNAME.${DOMAIN_NAME,,}"
  },
  "authentication": {
    "entity": "user",
    "service": "users",
    "secret": "G-KaPdSgVkYp3s5v8y/B?E(H+MbQeThW",
    "authStrategies": [
      "jwt",
      "local",
      "ldap",
      "sso",
      "sso2"
    ],
    "jwtOptions": {
      "header": {
        "typ": "access"
      },
      "audience": "https://yourdomain.com",
      "issuer": "feathers",
      "algorithm": "HS256",
      "expiresIn": "1d"
    },
    "local": {
      "usernameField": "username",
      "passwordField": "password"
    },
    "ldap": {
      "name": "ldap",
      "url": "ldap://${ADMIN_SERVER,,}:389",
      "bindDN": "${AD_USERNAME}@${DOMAIN_NAME^^}",
      "bindCredentials": "${AD_PASSWORD}",
      "searchBase": "$(echo ${DOMAIN_NAME^^} | awk -F'.' '{ print "DC="$1",DC="$2 }')",
      "searchFilter": "(|(uid={{username}})(sAMAccountName={{username}}))"
    }
  },
  "dc":"${ADMIN_SERVER,,}",
  "nedb": "../data",
  "mongodb": "${MONGODB_URL}"
}

EOL
cat > /srv/config/production.json <<EOL
{
  "host": "localhost",
  "port": "3030",
  "public": "../www",
  "adminfolder": "../www/",
  "prj_folder": "../projets",
  "admGroups": [
    "Utilisateurs DSI"
  ],
  "mailTransport": {
    "host": "${SMTP_SERVER,,}",
    "port": ${SMTP_PORT},
    "secure": ${SMTP_SECURE},
    "auth": {
      "user": "${SMTP_USER}",
      "pass": "${SMTP_PASS}"
    },
    "tls": {
      "ciphers": "SSLv3"
    }
  },
  "paginate": {
    "default": 10,
    "max": 50
  },
  "kerberos":{
    "service":"HTTP@$HOSTNAME.${DOMAIN_NAME,,}",
    "fqdn":"$HOSTNAME.${DOMAIN_NAME,,}"
  },
  "authentication": {
    "entity": "user",
    "service": "users",
    "secret": "G-KaPdSgVkYp3s5v8y/B?E(H+MbQeThW",
    "authStrategies": [
      "jwt",
      "local",
      "ldap",
      "sso",
      "sso2"
    ],
    "jwtOptions": {
      "header": {
        "typ": "access"
      },
      "audience": "https://yourdomain.com",
      "issuer": "feathers",
      "algorithm": "HS256",
      "expiresIn": "1d"
    },
    "local": {
      "usernameField": "username",
      "passwordField": "password"
    },
    "ldap": {
      "name": "ldap",
      "url": "ldap://${ADMIN_SERVER,,}:389",
      "bindDN": "${AD_USERNAME}@${DOMAIN_NAME^^}",
      "bindCredentials": "${AD_PASSWORD}",
      "searchBase": "$(echo ${DOMAIN_NAME^^} | awk -F'.' '{ print "DC="$1",DC="$2 }')",
      "searchFilter": "(|(uid={{username}})(sAMAccountName={{username}}))"
    }
  },
  "dc":"${ADMIN_SERVER,,}",
  "nedb": "../data",
  "mongodb": "${MONGODB_URL}"
}

EOL
fi
# ---------------------------------------------------------
#  INSTALLATION DE MON MOTEUR DE CREATION D'APPLIACTIONS WEB
# ---------------------------------------------------------
cd /srv
if [[ -f /srv/package.json ]]; then
echo --------------------------------------------------
echo 'Exécuting feathersjs serveur ...'
echo --------------------------------------------------
npm install
npm run start
fi
fi


echo --------------------------------------------------
echo 'Restarting Samba using supervisord'
echo --------------------------------------------------
exec "$@"