defmodule BlogPhoenix.Repo do
  use Ecto.Repo,
    otp_app: :blog_phoenix,
    adapter: Ecto.Adapters.Postgres
end
