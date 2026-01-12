# Publishing Go Module

This guide explains how to publish the Go library module.

## Go Module Publishing

Go modules are published via Git tags. There's no separate package registry - Go fetches modules directly from the Git repository.

## Publishing Steps

1. **Update Version**: Version is determined by Git tags

2. **Build and Test**:
   ```bash
   cd libs/go
   go build
   go test -v
   ```

3. **Commit Changes**:
   ```bash
   git add .
   git commit -m "Release Go module v2.1.0"
   ```

4. **Tag the Release**:
   ```bash
   git tag libs/go/v2.1.0
   git push origin libs/go/v2.1.0
   ```

## Module Path

The module path is: `github.com/renatovico/bin-cc/libs/go`

## Usage by Others

Users can import and use the module:

```go
import creditcard "github.com/renatovico/bin-cc/libs/go"

func main() {
    brand := creditcard.FindBrand("4012001037141112")
    fmt.Println(brand) // "visa"
}
```

Install the module:
```bash
go get github.com/renatovico/bin-cc/libs/go@v2.1.0
```

## GitHub Actions (Automated)

The project includes a GitHub Actions workflow for automated releases. To use it:

1. Create a GitHub release with tag `go-v*` (e.g., `go-v2.1.0`)

2. The workflow will automatically:
   - Run tests
   - Create the Git tag `libs/go/vX.Y.Z`
   - Make the module available via `go get`

## Version Guidelines

- Use semantic versioning: `MAJOR.MINOR.PATCH`
- Keep version in sync with main project version
- Tag releases as `libs/go/vX.Y.Z` (note the `libs/go/` prefix)
- For major version 2+, update module path to include version: `github.com/renatovico/bin-cc/libs/go/v2`

## Documentation

Documentation is automatically generated and published to pkg.go.dev when you push a new tag.

Visit: https://pkg.go.dev/github.com/renatovico/bin-cc/libs/go
