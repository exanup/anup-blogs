defmodule BlogPhoenixWeb.PageController do
  use BlogPhoenixWeb, :controller

  def index(conn, _params) do
    redirect(conn, to: Routes.demo_path(conn, :home))
  end
end
