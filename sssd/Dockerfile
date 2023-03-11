# Docker image file that describes an Debian image with PowerShell installed from Microsoft APT Repo
ARG imageRepo=debian

FROM ${imageRepo}:buster-slim AS installer-env

# Define Args for the needed to add the package
ARG PS_VERSION=7.2.0
ARG PS_PACKAGE=powershell-${PS_VERSION}-linux-x64.tar.gz
ARG PS_PACKAGE_URL=https://github.com/PowerShell/PowerShell/releases/download/v${PS_VERSION}/${PS_PACKAGE}
ARG PS_INSTALL_VERSION=7.2.0

# Download the Linux tar.gz and save it
ADD ${PS_PACKAGE_URL} /tmp/linux.tar.gz

# define the folder we will be installing PowerShell to
ENV PS_INSTALL_FOLDER=/opt/microsoft/powershell/$PS_INSTALL_VERSION

# Create the install folder
RUN mkdir -p ${PS_INSTALL_FOLDER}

# Unzip the Linux tar.gz
RUN tar zxf /tmp/linux.tar.gz -C ${PS_INSTALL_FOLDER}

FROM ${imageRepo}:buster-slim
#FROM debian:stable


ARG PS_VERSION=7.2.0
ARG PS_INSTALL_VERSION=7.2.0

# Copy only the files we need from the previous stage
COPY --from=installer-env ["/opt/microsoft/powershell", "/opt/microsoft/powershell"]

# Define Args and Env needed to create links
ARG PS_INSTALL_VERSION=7.2.0
ENV PS_INSTALL_FOLDER=/opt/microsoft/powershell/$PS_INSTALL_VERSION \
    \
    # Define ENVs for Localization/Globalization
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8 \
    # set a fixed location for the Module analysis cache
    PSModuleAnalysisCachePath=/var/cache/microsoft/powershell/PSModuleAnalysisCache/ModuleAnalysisCache \
    POWERSHELL_DISTRIBUTION_CHANNEL=PSDocker-Debian-10

# Install dependencies and clean up
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
    # less is required for help in powershell
        less \
    # requied to setup the locale
        locales \
    # required for SSL
        inetutils-ping \
        ca-certificates \
        gss-ntlmssp \
        libicu63 \
        libssl1.1 \
        libc6 \
        libgcc1 \
        libgssapi-krb5-2 \
        liblttng-ust0 \
        libstdc++6 \
        zlib1g \
    # PowerShell remoting over SSH dependencies
        openssh-client \
        && apt-get dist-upgrade -y \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/* \
        # enable en_US.UTF-8 locale
        && sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/g' /etc/locale.gen \
        # generate locale
        && locale-gen && update-locale

    # Give all user execute permissions and remove write permissions for others
RUN chmod a+x,o-w ${PS_INSTALL_FOLDER}/pwsh \
    # Create the pwsh symbolic link that points to powershell
    && ln -s ${PS_INSTALL_FOLDER}/pwsh /usr/bin/pwsh \
    # Create the pwsh-lts symbolic link that points to powershell
    && ln -s ${PS_INSTALL_FOLDER}/pwsh /usr/bin/pwsh-lts \
    # intialize powershell module cache
    # and disable telemetry
    && export POWERSHELL_TELEMETRY_OPTOUT=1 \
    && pwsh \
        -NoLogo \
        -NoProfile \
        -Command " \
          \$ErrorActionPreference = 'Stop' ; \
          \$ProgressPreference = 'SilentlyContinue' ; \
          while(!(Test-Path -Path \$env:PSModuleAnalysisCachePath)) {  \
            Write-Host "'Waiting for $env:PSModuleAnalysisCachePath'" ; \
            Start-Sleep -Seconds 6 ; \
          }"


RUN sh -c "yes | pwsh -Command 'Install-Module -Name PSWSMan'"
RUN pwsh -Command 'Install-WSMan'

ENV TERM=xterm

ENV DEBIAN_FRONTEND noninteractive



RUN apt-get -y update && \
    apt-get -y  --no-install-recommends install \
        dnsutils \
        vim \
        nano \
        crudini \
        dbus \
        realmd \
        krb5-kdc \
        krb5-admin-server \
        krb5-user \
        libkrb5-dev \
        libpam-krb5 \
        libpam-ccreds \
        adcli \
        winbind \
        libnss-winbind \
        libpam-winbind \
        samba \
        samba-dsdb-modules \
        samba-client \
        samba-vfs-modules \
        logrotate \
        attr \
        libpam-mount \
        policykit-1 \
        packagekit \
        sssd \
        sssd-tools \
        libnss-sss \
        libnss3-tools \
        libpam-sss \
        libnss-ldap \
        inetutils-ping \
        rdate \
        acl \
        gnupg apt-transport-https \
        gss-ntlmssp \
        supervisor 

RUN apt-get -y install php php-cli php-mbstring apache2 libapache2-mod-php libapache2-mod-auth-kerb libldap2-dev php-ldap ldap-utils python-dev sasl2-bin libsasl2-2 libsasl2-modules libsasl2-modules-gssapi-mit libsasl2-dev gcc

RUN a2enmod rewrite &&\
    a2dissite 000-default

RUN apt-get update    
RUN apt-get install -y apt-utils debconf-utils dialog
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN echo "resolvconf resolvconf/linkify-resolvconf boolean false" | debconf-set-selections
RUN apt-get update
RUN apt-get install -y resolvconf

RUN apt-get update -yq \
    && apt-get install curl gnupg curl apt-transport-https wget htop git zip unzip nano ncdu build-essential chrpath libssl-dev libxft-dev pkg-config glib2.0-dev libexpat1-dev gobject-introspection python-gi-dev apt-transport-https libgirepository1.0-dev libtiff5-dev libjpeg-dev libgsf-1-dev fail2ban -yq \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt-get install nodejs -yq

RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-debian-buster-prod buster main" > /etc/apt/sources.list.d/microsoft.list'
RUN apt-get update -yq && \
    apt-get -y install \
    dotnet-runtime-deps-2.1


RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN systemctl enable sssd

RUN mkdir -p /var/lib/samba/private

RUN chmod 777 /home

RUN env --unset=DEBIAN_FRONTEND



# Configure /app folder with sample app && rm -fr /var/www/html && ln -s /app /var/www/html
#RUN mkdir -p /app 

#ADD app /app

# Add volumes for the app 
VOLUME  [ "/srv", "/src/www", "/src/projets" ]

EXPOSE 137 138 139 443 445 80 3030

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
COPY assets/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
ENTRYPOINT ["/docker-entrypoint.sh"]

WORKDIR /srv

CMD ["/usr/bin/supervisord","-c","/etc/supervisor/conf.d/supervisord.conf"]





