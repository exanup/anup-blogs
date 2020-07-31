defmodule BlogPhoenixWeb.DemoController do
  use BlogPhoenixWeb, :controller

  def login(conn, _params) do
    render(conn, "login.html")
  end
end
