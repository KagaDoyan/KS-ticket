param (
    [string]$env
)

function Deploy-Dev {
    Write-Output "Building and deploying development environment..."
    docker build -t dev:latest . # Build and tag dev image
    docker-compose up -d app-dev # Run dev container in detached mode
}

function Deploy-Prd {
    Write-Output "Building and deploying production environment..."
    docker build -t prd:latest . # Build and tag prd image
    docker-compose up -d app-prd # Run prd container in detached mode
}

if ($env -eq "dev") {
    Deploy-Dev
} elseif ($env -eq "prd") {
    Deploy-Prd
} else {
    Write-Output "Usage: .\deploy.ps1 -env [dev|prd]"
    Write-Output "Specify 'dev' to deploy the development environment or 'prd' to deploy the production environment."
}
