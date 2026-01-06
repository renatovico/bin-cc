defmodule CreditcardIdentifier.MixProject do
  use Mix.Project

  @version "1.0.0"
  @source_url "https://github.com/renatovico/bin-cc"

  def project do
    [
      app: :creditcard_identifier,
      version: @version,
      elixir: "~> 1.10",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      description: description(),
      package: package(),
      name: "CreditCard Identifier",
      source_url: @source_url,
      docs: docs()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    [
      {:jason, "~> 1.4"},
      {:ex_doc, "~> 0.29", only: :dev, runtime: false}
    ]
  end

  defp description do
    """
    Credit card BIN validation using bin-cc data.
    Provides functions to identify card brands, validate CVV codes, and more.
    """
  end

  defp package do
    [
      name: "creditcard_identifier",
      files: ~w(lib data .formatter.exs mix.exs README.md LICENSE),
      licenses: ["MIT"],
      links: %{
        "GitHub" => @source_url,
        "Documentation" => "https://github.com/renatovico/bin-cc/tree/main/libs/elixir"
      }
    ]
  end

  defp docs do
    [
      main: "readme",
      extras: ["README.md"],
      source_ref: "v#{@version}",
      source_url: @source_url
    ]
  end
end
