# VV_SRV

## Serveur BackOffice basé sur feathersjs pour sites webs

### Sous windows

  Ouvrez une fenetre powershell en mode admin

* **Chocolatey** : Installateur de logiciels en ligne de commande powershell
  * Script d'installation :
  
  ```powershell
  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
  ```

* **Node 12.22.1** : Exemple d'installation  à l'aide de chocolatey en utilisant `nvm`
  
  ```powershell
    choco install -y nvm 
  ```

  Fermez toutes les fenetres powershell et relancer le powershell en mode admin

  ```
    nvm install 12.22.1  x64  --lts
    nvm use 12.22.1
  ```

* [**Git Bash**](https://git-scm.com/downloads) (ou un autre client Git)

* **MongoDB** : Exemple d'installation à l'aide de chocolatey
  
  ```
    choco install -y mongodb mongodb-shell
  ```

* **Github For Windows** : Exemple d'installation à 'aide de chocolatey
  
  ```
    choco install -y github.commandline githubforwindows
  ```
  
* **Python 3** : Exemple d'installation à l'aide de chocolatey
  
  ```dotnetcli
    choco install -y python3
  ```

* **ActivedirectoryTools** : si vous êtes sous windows et utiliser les commandes powershell

```dotnetcli
choco install rsat -params '"/Server:2016"'
```

Install-WindowsFeature RSAT-ADDS

Windows 10 (pre-1809) RSAT version recommendations:
use the latest (default) when managing Windows Server, version 1803 or 1709 (Both 1803 and 1709 are available if needed.)
use 2016 when managing Windows Server 2016 or previous versions

## Installation

 Pour le moment l'installation se fait en clonant ce reposotory

 ```
  choco install -y githubforwindows
  git clone https://github.com/CACEM-TEAM/cacem-srv  monbackoffice
  cd monbackoffice
  npm install
  npm run prod:test
 ```

## Securisé  mongodb server

  ```
    use admin

    use admin
    db.createUser(
      {
        user: "", // user dans config/default.json / production.json
        pwd: "", // password dans config/default.json / production.json
        roles: [
          { role: "userAdminAnyDatabase", db: "admin" },
          { role: "readWriteAnyDatabase", db: "admin" }
        ]
      }
    )
  ```

# arreter mongodb

puis modifier le fichier ***mongodb.cfg*** : ajouter:

  ```
  security:
    authenticated: enabled
  ```

## Configuration demarrage auto en service pm2

  ```
  npm install pm2@latest -g

  pm2 start
  ```

## Encryption des mots de passes des fichier de conf

# Generateur de cles [**keygen**](https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx)

# definissez un clé secrete  en PS

$Env:SECRET="clesecrete"

# definissez une cle secrete en linux

set SECRET="clesecret"

# creer un script .js avec

const vvtools = require("./encrypt2");

console.log("decryptpas",vvtools.encrypt("decryptpass"))

## Configuration pour sharepoint

# installez tout d'abort

npm install node-sp-auth-config -g

# exécutez la commande suivante pour rentrer les informations de connexion a votre serveur sharepoint

sp-auth init --path ./config/private.config.json

## faire la demande de certicifat ssl

<https://codesandbox.io/s/generate-csr-0qhed?file=/index.html>

# Pour tout ce qui est agglo.local

<https://ca-01.agglo.local/Certsrv>
