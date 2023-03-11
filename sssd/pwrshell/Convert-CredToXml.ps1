param (
    [Parameter(Mandatory = $false)]
    [PSCredential] $Cred = (Get-Credential)
)

@{
    user = $Cred.UserName
    pass = $Cred.Password | ConvertFrom-SecureString
} | Export-CliXml -Path '.\cred.xml'
# | ConvertTo-Json -Compress