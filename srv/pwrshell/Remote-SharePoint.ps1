#Enable-WSmanCredSSP -Role Client -DelegateComputer "PO-HDECHAVIGNYADM.agglo.local" -Force
$username = "spadmin@agglo.local"; 
$password = ConvertTo-SecureString "Cacem972$" -AsPlainText -Force; 
$usercred = New-Object System.Management.Automation.PSCredential -ArgumentList ($username, $password); 
$session = New-PSSession  -ComputerName "svrsharepoint2.agglo.local" -authentication credssp  -Credential $usercred;
Invoke-Command -Session $session -scriptblock {
Add-PSSnapin Microsoft.SharePoint.PowerShell;
Get-SPSite -WebApplication "http://svrsharepoint2:80";
} |ConvertTo-Json