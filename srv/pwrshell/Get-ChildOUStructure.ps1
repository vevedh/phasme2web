
function Get-RandomHexString {
  param($count)
  $hex = '012345679ABCDEF'.ToCharArray()
  $array = foreach($number in 1..$count ){ $hex | Get-Random}
  return (($array) -join "").ToString().ToLower()

}
function Get-ChildOUStructure {
  <#
  .SYNOPSIS
  Create JSON exportable tree view of AD OU (or other) structures.
  .DESCRIPTION
  Create JSON exportable tree view of AD OU (or other) structures in Canonical Name format.
  .PARAMETER ouarray
  Array of OUs in CanonicalName format (ie. domain/ou1/ou2)
  .PARAMETER oubase
  Base of OU
  .EXAMPLE
  $OUs = @(Get-ADObject -Filter {(ObjectClass -eq "OrganizationalUnit")} -Properties CanonicalName).CanonicalName
  $test = $OUs | Get-ChildOUStructure | ConvertTo-Json -Depth 20
  .NOTES
  Author: Zachary Loeber
  Requires: Powershell 3.0, Lync
  Version History
  1.0.0 - 12/24/2014
      - Initial release
  .LINK
  https://github.com/zloeber/Powershell/blob/master/ActiveDirectory/Get-ChildOUStructure.ps1
  .LINK
  http://www.the-little-things.net
  #>
  [CmdletBinding()]
  param(
      [Parameter(Position=0, ValueFromPipeline=$true, Mandatory=$true, HelpMessage='Array of OUs in CanonicalName formate (ie. domain/ou1/ou2)')]
      [string[]]$ouarray,
      [Parameter(Position=1, HelpMessage='Base of OU.')]
      [string]$oubase = ''
  )
  begin {
      $newarray = @()
      $base = ''
      $firstset = $false
      $ouarraylist = @()
  }
  process {
      $ouarraylist += $ouarray
  }
  end {
      $ouarraylist = $ouarraylist | Where-Object {($_ -ne $null) -and ($_ -ne '')} | Select-Object -Unique | Sort-Object
      if ($ouarraylist.count -gt 0) {
          $ouarraylist | ForEach-Object {
             # $prioroupath = if ($oubase -ne '') {$oubase + '/' + $_} else {''}
              $firstelement = @($_ -split '/')[0]
              $regex = "`^`($firstelement`?`)"
              $tmp = $_ -replace $regex,'' -replace "^(\/?)",''

              if (-not $firstset) {
                  $base = $firstelement
                  $firstset = $true
              }
              else {
                  if (($base -ne $firstelement) -or ($tmp -eq '')) {
                      Write-Verbose "Processing Subtree for: $base"


                      $fulloupath = if ($oubase -ne '') {$oubase + '/' + $base} else {$base}
                      New-Object psobject -Property @{
                          'id' = "$(Get-RandomHexString -Count 24)"
                          'name' = $base
                          'path' = $fulloupath
                          'children' = if ($newarray.Count -gt 0) {,@(Get-ChildOUStructure -ouarray $newarray -oubase $fulloupath)} else {$null}
                      }
                      $base = $firstelement
                      $newarray = @()
                      $firstset = $false
                  }
              }
              if ($tmp -ne '') {
                  $newarray += $tmp
              }
          }
          Write-Verbose "Processing Subtree for: $base"
          $fulloupath = if ($oubase -ne '') {$oubase + '/' + $base} else {$base}
          New-Object psobject -Property @{
              'id' = "$(Get-RandomHexString -Count 24)"
              'name' = $base
              'path' = $fulloupath
              'children' = if ($newarray.Count -gt 0) {,@(Get-ChildOUStructure -ouarray $newarray -oubase $fulloupath)} else {$null}
          }
      }
  }
}
$OUs = @(Get-ADObject -Filter {(ObjectClass -eq "OrganizationalUnit")} -Properties CanonicalName).CanonicalName
$test = $OUs | Get-ChildOUStructure | ConvertTo-Json -Depth 20
write-host $test
