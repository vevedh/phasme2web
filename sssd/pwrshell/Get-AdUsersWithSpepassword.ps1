param (
    [Parameter(Mandatory = $true)]
    [string]$badPassword
)
begin {

$userCollection = Get-ADUser -LDAPFilter "(&(samAccountType=805306368)(!(sn=Exchange))(mail=*)(givenName=*)(sn=*))" -Server "DC12.agglo.local"  -Properties * | select-object sAMAccountName,mail

#$badPassword = "Aa11111;"
#$goodPassword = "#p@sSw0rd!"

function Is-Authenticated($userName, $password){
	$secpasswd = ConvertTo-SecureString $password -AsPlainText -Force
	$userCreds = New-Object System.Management.Automation.PSCredential ($userName, $secpasswd)
	$userCredName = $userCreds.username
	$userCredPassword = $userCreds.GetNetworkCredential().password
	$CurrentDomain = "LDAP://" + ([ADSI]"").distinguishedName
	$domain = New-Object System.DirectoryServices.DirectoryEntry($CurrentDomain,$userCredName,$userCredPassword)
	if ($domain.name -eq $null)
	{
		Return $false
	}
	else
	{
	 	Return $true
	}
}

foreach ($user in $userCollection){
	$userName = $user.sAMAccountName
  $email = $user.mail
	If (Is-Authenticated $userName $badPassword){
		#Set-ADAccountPassword –Identity $userName -Reset -NewPassword (ConvertTo-SecureString -AsPlainText $goodPassword –Force)
    Write-Host "$userName;$email" -ForegroundColor Red
		Write-Output "$userName;$email"

	}
}
}
