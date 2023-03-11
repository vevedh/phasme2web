[CmdletBinding()]
param (
	[Parameter( Mandatory=$true)]
	[string]$Path,

  [Parameter(Mandatory=$false)]
  [Switch]$File

)

function Get-RandomHexString {
  param($count)
  $hex = '012345679ABCDEF'.ToCharArray()
  $array = foreach($number in 1..$count ){ $hex | Get-Random}
  return (($array) -join "").ToString().ToLower()

}
function Add-Tabstops{
  param($Count)
  $tabs = ""
  for($i=0; $i -lt $Count; $i++){$tabs += "  "}
  return $tabs
}

function Output-JsonChildren{
  param($Path, $Level = 1)
  return $(Get-ChildItem -Path $Path -Directory -Recurse| Where-Object{$_} | ForEach-Object{
      (Add-Tabstops $Level) +
      "{`n" +
      (Add-Tabstops ($Level+1)) +
        "`"_id`"`: `"$(Get-RandomHexString -Count 24)`"," +
        "`n" +
      (Add-Tabstops ($Level+1)) +
      "`"name`"`: `"$($_.Name)`"," +
      "`n" +
      (Add-Tabstops ($Level+1)) +
      "`"children`": ["+
      $(if($_.psiscontainer){"`n" + (Output-JsonChildren -Path $_.FullName -Level ($Level+2))+ "`n" + (Add-Tabstops ($Level+1))}) +
      "]`n" +
      (Add-Tabstops ($Level)) +
      "}"
  }) -join ",`n"
}


function Output-JsonChildrenFile{
  param($Path, $Level = 1)
  return $(Get-ChildItem -Path $Path  -Recurse| Where-Object{$_} | ForEach-Object{
      (Add-Tabstops $Level) +
      "{`n" +
      (Add-Tabstops ($Level+1)) +
      "`"name`"`: `"$($_.Name)`"," +
      "`n" +
      (Add-Tabstops ($Level+1)) +
      "`"children`": ["+
      $(if($_.psiscontainer){"`n" + (Output-JsonChildrenFile -Path $_.FullName -Level ($Level+2))+ "`n" + (Add-Tabstops ($Level+1))}) +
      "]`n" +
      (Add-Tabstops ($Level)) +
      "}"
  }) -join ",`n"
}

IF ($PSBoundParameters['File']) {
  $JSON = Output-JsonChildrenFile -Path $Path
} else {
  $JSON = Output-JsonChildren -Path $Path
}

Write-Output "["$JSON"]"
