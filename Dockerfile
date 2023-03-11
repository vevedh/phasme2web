
# From Microsoft's official Centos-7 image
FROM mcr.microsoft.com/powershell:centos-7

# Obligatory update
RUN yum update -y

# Required for gssntlmssp
RUN yum install -y epel-release

# Update now that we have epel-release
RUN yum update -y

# Install libraries for NTLM support
RUN yum install -y gssntlmssp


RUN (curl -sL https://rpm.nodesource.com/setup_12.x | bash -) \
  && yum clean all -y \
  && yum update -y \
  && yum install -y nodejs \
  && yum autoremove -y \
  && yum clean all -y \
  && npm install npm --global

# Configure /app folder with sample app && rm -fr /var/www/html && ln -s /app /var/www/html
#RUN mkdir -p /app 

#ADD app /app

# Add volumes for the app 
VOLUME  /srv

EXPOSE 137 138 139 445 80 3030


# Launch PowerShell
ENTRYPOINT ["/usr/bin/pwsh"]