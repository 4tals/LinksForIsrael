$ErrorActionPreference = 'Stop'

$categoryFolders = Get-ChildItem -LiteralPath "$PSScriptRoot/../../_data/links" -Directory -Force

$categoryDisplayNames = @()
foreach ($categoryFolder in $categoryFolders) {
    $categoryName = Split-Path -Leaf -Path $categoryFolder
    Write-Host "Processing category: $categoryName"

    $categoryJsonFile = Join-Path -Path $categoryFolder -ChildPath "links.json"
    $category = Get-Content -Raw -LiteralPath $categoryJsonFile | ConvertFrom-Json
    
    Write-Host "Category Display Name: $($category.displayName)"

    if ($category.links) {
        Write-Host "Top-level category detected: $($category.name)"
        $categoryDisplayNames += "$($category.name) | $($category.displayName)" 
    }

    $subCategoryFolders = Get-ChildItem -LiteralPath $categoryFolder -Directory -Force
    foreach ($subCategoryFolder in $subCategoryFolders) {
        $subCategoryName = Split-Path -Leaf -Path $subCategoryFolder
        Write-Host "Processing sub-category: $subCategoryName"

        $subCategoryJsonFile = Join-Path -Path $subCategoryFolder -ChildPath "links.json"
        $subCategory = Get-Content -Raw -LiteralPath $subCategoryJsonFile | ConvertFrom-Json

        Write-Host "Sub-Category Display Name: $($subCategory.displayName)"
        $categoryDisplayNames += "$($category.name)/$($subCategory.name) | $($category.displayName)\$($subCategory.displayName)"
    }
}

Write-Host "Category display names:"
Write-Host "-----------------------"
$categoryDisplayNames -join [System.Environment]::NewLine