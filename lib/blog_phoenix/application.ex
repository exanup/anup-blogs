defmodule BlogPhoenix.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      BlogPhoenix.Repo,
      # Start the Telemetry supervisor
      BlogPhoenixWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: BlogPhoenix.PubSub},
      # Start the Endpoint (http/https)
      BlogPhoenixWeb.Endpoint
      # Start a worker by calling: BlogPhoenix.Worker.start_link(arg)
      # {BlogPhoenix.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: BlogPhoenix.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    BlogPhoenixWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
