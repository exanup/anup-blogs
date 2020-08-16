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

  def blog(conn, _params) do
    path = "./lib/blog_phoenix_web/templates/demo/blog.md"

    content =
      path
      |> Path.expand()
      |> File.read!()
      |> Earmark.as_html!(%Earmark.Options{code_class_prefix: "lang-"})
      |> Phoenix.HTML.raw()

    render(conn, "blog.html", content: content)
  end
end
