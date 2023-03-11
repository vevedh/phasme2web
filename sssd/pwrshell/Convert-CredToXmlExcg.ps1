param (
    [Parameter(Mandatory = $false)]
    [PSCredential] $Cred = (Get-Credential)
)

@{
    user = $Cred.UserName
    pass = $Cred.Password | ConvertFrom-SecureString
} | Export-CliXml -Path '.\exgcred.xml'
# | ConvertTo-Json -Compress
