defmodule BlogPhoenixWeb.PageController do
  use BlogPhoenixWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
