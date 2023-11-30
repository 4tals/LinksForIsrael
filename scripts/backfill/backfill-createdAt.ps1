$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

$categoryJsonFiles = Get-ChildItem -LiteralPath "$PSScriptRoot/../../_data/links" -Filter "*.json" -File -Recurse -Force
foreach ($categoryJsonFile in $categoryJsonFiles) {
    $category = Get-Content -Raw -LiteralPath $categoryJsonFile.FullName | ConvertFrom-Json
    if (!$category.links) {
        Write-Host "Skipping non-links JSON: $categoryJsonFile"
        continue
    }

    foreach ($initiative in $category.links) {
        if ($initiative.createdAt) {
            Write-Host "Initiative '$($initiative.name)' already has createdAt field: $($initiative.createdAt)"
            continue
        }

        $gitArgs = @("log", "-G$($initiative.Name)", "--reverse", '--pretty=format:%cI|||%s')
        Write-Host "Executing: git $gitArgs"
        $gitOutput = & git @gitArgs
        Write-Verbose "git output: $gitOutput"
        
        $firstCommitDetails = $gitOutput.Split([Environment]::NewLine)[0]
        Write-Host "first commit details: $firstCommitDetails"
        $firstCommitParts = $firstCommitDetails.Split("|||")
        
        $firstCommitDate = $firstCommitParts[0]
        Write-Verbose "first commit date: $firstCommitDate"
        
        $firstCommitTitle = $firstCommitParts[1]
        Write-Verbose "first commit title: $firstCommitTitle"

        $initiative | Add-Member -MemberType NoteProperty -Name "createdAt" -value $firstCommitDate
    }

    $category | ConvertTo-Json -Depth 32 | Out-File $categoryJsonFile.FullName
}