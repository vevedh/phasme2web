function ConnectTo-Exchange
{
	$User = $env:USERDOMAIN + "\" + $env:USERNAME
	$Cred = (Get-Credential -UserName $User -Message "Enter password")
	$Session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri http://mail.cacem.fr/powershell -Credential $Cred
	Import-PSSession $Session
}