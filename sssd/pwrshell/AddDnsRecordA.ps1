param (
    [Parameter(Mandatory = $false)]
    [string]$Username,
    [string]$Pass,
    [string]$Dc,
    [string]$Computer,
    [string]$Ip,
    [string]$Domain
)
begin {

  $password = ConvertTo-SecureString $Pass -AsPlainText -Force
  $usercred = New-Object System.Management.Automation.PSCredential   -ArgumentList ($Username, $password)
  $sba = [scriptblock]::Create("Remove-DnsServerResourceRecord -ZoneName $Domain -RRType ""A"" -Name $Computer -Force")
  $sb = [scriptblock]::Create("Add-DnsServerResourceRecordA -Name $Computer -ZoneName $Domain -AllowUpdateAny -IPv4Address $Ip -TimeToLive 01:00:00")
  Invoke-Command -ComputerName $Dc -Authentication Negotiate -Credential $usercred -scriptblock $sba
  Invoke-Command -ComputerName $Dc -Authentication Negotiate -Credential $usercred -scriptblock $sb


}
