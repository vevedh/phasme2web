Param
    (
        [string]$UserName,
        [string]$Password
    )
    if (!($UserName) -or !($Password)) {
        Write-Warning 'Test-ADCredential: Please specify both user name and password'
    } else {
        try {
            $pwdSecureString = ConvertTo-SecureString -Force -AsPlainText $Password
            $psCred = New-Object System.Management.Automation.PSCredential -ArgumentList ($Username, $pwdSecureString)
            Import-Module MSOnline
            Connect-MSolService -Credential $psCred
            $Session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri https://ps.outlook.com/powershell-liveid/ -Credential $psCred -Authentication Basic -AllowRedirection 
            Import-PSSession $Session -AllowClobber -DisableNameChecking
        }
        catch {
          Write-Host  $false  
        }
        
    }