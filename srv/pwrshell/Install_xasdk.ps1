$msiPath = ".\\"
$msi = @(($msipath+"Citrix.Common.Commands.Install_x64.msi"), ($msipath+"Citrix.XenApp.Commands.Client.Install_x64.msi"), ($msipath+"Citrix.XenApp.Server.Sdk_x64.msi"), ($msipath+"CitrixGroupPolicyManagement_x64.msi"))

foreach($_ in $msi)
 {Start-Process -FilePath msiexec -ArgumentList /i, $_, /qb- -Wait
 Write-Host "$msi"
 }

import-module ($msiPath+"Citrix.GroupPolicy.Commands")