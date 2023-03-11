param (
    [Parameter(Mandatory = $false)]
    [string]$Username,
    [string]$DomainName,
    [string]$Computer
)
begin {

    get-credential -message "mot de passe utilisateur ?" -UserName $Username | Export-Clixml -Path '.\exgcred.xml'
    #$DomainCredential = Import-Clixml -Path '.\exgcred.xml'
    #Add-Computer -ComputerName $Computer -DomainName $DomainName -Credential $DomainCredential  -Restart -Force
	  #Write-Verbose "The computer $Computer has been joined to domain. Waiting for the final reboot"
	  #Wait-Reboot -Computername $Computer -Credential $DomainCredential

}
