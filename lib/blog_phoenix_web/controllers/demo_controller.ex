defmodule BlogPhoenixWeb.DemoController do
  use BlogPhoenixWeb, :controller

  def login(conn, _params) do
    render(conn, "login.html")
  end

  def signup(conn, _params) do
    render(conn, "signup.html")
  end

  def home(conn, _params) do
    render(conn, "home.html")
  end
end
