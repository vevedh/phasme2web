# Write-host (join-path ($PsScriptRoot) 'exgcred.xml')
# $pathj = (join-path ($PsScriptRoot) 'exgcred.xml')
# $usercred = Import-CliXml -Path $pathj
$username = "admexchange@agglo.local"
$password = ConvertTo-SecureString "FiniLeCl0ud" -AsPlainTex -Force;
$usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password)
$session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri http://svrexchg1.agglo.local/PowerShell -Authentication Kerberos -Credential $usercred  -AllowRedirection
Invoke-Command -Session $session -scriptblock { Get-mailbox hdechavigny } |ConvertTo-Json
