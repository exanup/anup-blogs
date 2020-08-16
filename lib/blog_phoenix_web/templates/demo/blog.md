## Introduction

In this guide, **LEMP** stands for **Linux**, **Nginx** (pronounced as
Engine-X), **MySQL** and **PHP** (PHP Hypertext Preprocessor). Also, as a
bonus, we will also learn to setup phpMyAdmin.

I have gone through many websites in order to learn even just the basics of
setting up a LEMP server. Hence I know the hassle. Here I have created a
through guide to help someone relatively new to setup a powerful LEMP machine
easily and effortlessly. I hope this guide comes to someone's rescue.

The instructions on this guide has been tested to work on a fresh install of
Ubuntu 18.04 as the time of this writing (NPT 11/03/2018 10.26AM). Also, the
system was fully updated before we started with the LEMP setup procedure.

For any other platform, this guide should still serve as a useful resource. The
"mini goals" are well defined in various paragraphs. And one can easily look
elsewhere for specific instructions for that platform to achieve same "mini
goal", one at a time.

For a system already running other version of server stacks (example LAMP),
some additional steps (like removing those packages or disabling them) might
be required. That is beyond the scope of this guide.

### Specifications/Target

- **Ubuntu** v18.04
- **Nginx** v1.15
- **MySQL** v8.0
- **PHP** v7.2
- **(Bonus) phpMyAdmin** v4.8

But before we start, let's quickly make sure that we have some basic tools
ready. Run the following commands in the terminal.

```shell
sudo apt update
sudo apt install wget
sudo apt install software-properties-common
```

Now let's start!

## Custom Repositories

Before beginning the installation, we want to add some repositories which
will give us the latest corresponding packages for our server stack.

### Nginx Repository

For Ubuntu, in order to authenticate the Nginx repository signature and to
eliminate warnings about missing PGP key during installation of the Nginx
package, it is necessary to add the key used to sign the Nginx packages and
repository to the apt program keyring. Only after then we will dare to add the
repositories.

_The above fact is true every time we add a custom repository. If we don't
want to add any custom repository and use the ones provided to us by "vanilla"
Ubuntu itself, we can just ignore this section of the guide, entirely. We have
to keep in mind that the version numbers used in this guide are according to
the default, most recent versions of the respective packages at the time of
creation of this guide. So, we might have to be careful in coming sections of
the guide where we start installation and setup of the stack. We would want to
make sure then, that the version number would match to what we have installed,
not what is shown in this guide._

Run the following code one by one in the terminal to add the Nginx mainline
repository. We need to accept any prompts, if asked.

```shell
wget https://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key && rm nginx_signing.key
sudo sed -i '$a deb http://nginx.org/packages/mainline/ubuntu/ bionic nginx' /etc/apt/sources.list
sudo sed -i '$a # deb-src http://nginx.org/packages/mainline/ubuntu/ bionic nginx' /etc/apt/sources.list
```

### MySQL Repository

Just like we did with Nginx, we will add the MySQL repository. Run the
following commands in the terminal to do so. We need to accept any prompts,
if asked.

_During the installation of the package, you will be asked to choose the
versions of the MySQL server and other components. Just select `Ok` and hit
the key `Enter` to complete the setup._

```shell
wget https://dev.mysql.com/get/mysql-apt-config_0.8.10-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.10-1_all.deb && rm mysql-apt-config_0.8.10-1_all.deb
```

### PHP Repository

The repository here we are going to install is the PHP PPA by
[Ondrej](https://launchpad.net/~ondrej/+archive/ubuntu/php 'Ondrej PHP PPA').
We can update our system with _"unsupported"_ packages from this _"untrusted"_
PPA by adding ppa:ondrej/php to our system's Software Sources. The following
commands will help us to do so. We need to accept any prompts, if asked.

```shell
sudo add-apt-repository ppa:ondrej/php
```

_We might feel a little bit confused by the terms "untrusted PPA", but there
is actually no reason to worry. We just need to remember that this is **not**
an official upgrade path. But the PPA is well known, and is relatively safe
to use._

### (Bonus) phpMyAdmin Repository

Default Ubuntu repository gives us only the 4.6.6 version, whereas the latest
version currently is 4.8.3. To tackle this issue, we will use the `STABLE`
branch of `phpMyAdmin` directly from its official GitHub repository. We will
see later how.

## The Installation

Let's finally begin the actual installations processes.

_During the installation of any package, when faced with any unsure prompt,
just go with the default option/action._

### Update APT

First, we want to make sure we have the latest records in our local packages
registry. Let's run the following command in the terminal like so.

```shell
sudo apt update
```

### Installing Nginx

First thing we’re going to install is the server called Nginx.

```shell
sudo apt install nginx
```

We can check if Nginx is installed by typing `nginx -v` in the terminal.

### Installing MySQL

Now we want to install the database management system (DBMS). We choose MySQL.

```shell
sudo apt install mysql-server mysql-client
```

We can check if MySQL is installed by executing `mysql --version` in the
terminal.

### Installing PHP

Next thing we want to install is PHP. We need to install PHP with a few
extensions that are mandatory for modern web applications.

```shell
sudo apt install php-bz2 php-cli php-common php-curl php-fpm php-gd \
    php-gettext php-mbstring php-mysql php-pear php-phpseclib php-sqlite3 \
    php-tcpdf php-xdebug php-xml php-zip
```

We may run `php -v` in the terminal to check the version of PHP installed.

## Configurations

Time to make the installations "talk" to each other.

### Configuring Nginx

We don't need to change anything right now. But if we want to, we can change
the main configuration of Nginx as follows:

```shell
sudo gedit /etc/nginx/nginx.conf
```

In the config file, notice the line with `user nginx`. This means Nginx will
run as the user **nginx**. We should not forget to restart the Nginx service
if we made any change to the configuration file.

```shell
sudo systemctl restart nginx.service
```

### Configuring PHP to work with Nginx

In order for PHP and Nginx to work together, we need to configure both of them.
_We need to make sure that PHP-FPM (PHP FastCGI Process Manager) runs as the **same
user** as Nginx._ And for that we need to run the following command in the
terminal.

```shell
sudo gedit /etc/php/7.2/fpm/pool.d/www.conf
```

And change the relevant lines as:

```ini
...
user = nginx
group = nginx
...
listen.owner = nginx
listen.group = nginx
...
```

_Note the command where we used ... php/**7.2**/fpm ... . We want to make sure
that **7.2** is the version that we actually have installed in our system.
Refer [this](#installing-php) section to go back and see how we installed PHP
and PHP-FPM, and how to see the version of PHP installed._

If we made changes to the configuration, we need to run the following in the
terminal to load the changes.

```shell
sudo systemctl restart php7.2-fpm.service
```

### Configuring Xdebug for PHP

Xdebug can be very helpful during development of php applications. To set it
up, open the configuration file `/etc/php/7.2/fpm/conf.d/20-xdebug.ini` as
follows:

```shell
sudo gedit /etc/php/7.2/fpm/conf.d/20-xdebug.ini
```

And replace the contents with this:

```ini
zend_extension=xdebug.so
xdebug.remote_enable=1
xdebug.remote_handler=dbgp
xdebug.remote_host=localhost
xdebug.remote_port=9009
xdebug.remote_autostart=1
xdebug.var_display_max_depth=10
xdebug.auto_trace=on
xdebug.show_error_trace=on
xdebug.show_exception_trace=on
```

_Let's not forget the 9009 port while setting up debugger in our IDE!_

Save and restart the php-fpm service.

```shell
sudo systemctl restart php7.2-fpm.service
```

### Default Site

Now comes the fun part where we create a default site that supports PHP. In our
case, we want `~/www` as our directory of all websites. Normally, `/var/www` is
used as the default one. Here we want to change it to a custom directory inside
our home directory, as mentioned above.

_Please note extra carefully that this might be nor the smartest neither the
safest idea to let the web directory to have same ownership as the "human"
user! But we are doing this for our ease. Please do remember that "ease" and
"security" usually contradict each other!_

First, we want to make sure the directory exists. Let's create a default site
directory `_default_` with the following command.

```shell
mkdir -p ~/www/_default_/public
```

_Note that to add other sites, we can follow a similar pattern. We may create
a new folder for each site, which has a `public` folder in it as the public
entry point of the site._

Now to edit the default site configuration, let's run the following command in
the terminal.

```shell
sudo cp /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
sudo gedit /etc/nginx/conf.d/default.conf
```

And replace its content with this:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /home/[OUR_USERNAME]/www/_default_/public;

    index index.html index.htm index.php;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
        autoindex on;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php7.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

_Please note that we need to change **[OUR\_USERNAME]** from above config file
to our actual username._

Now let's run the following to reload our new configuration.

```shell
sudo systemctl restart nginx.service
```

Now we should be able to see on browser that
[http://localhost](http://localhost 'Localhost') actually works, and most
probably shows an empty index.

**\*\*Ba Dum Tis\*\***

We can put any file in the `~/www/_default_/public` directory and it should be
showing in the browser after a refresh.

### Configuring MySQL

This one is easy. Let's open our terminal and run the following:

```shell
sudo mysql_secure_installation
```

We just need to **carefully** follow all of the prompts and we will properly
set up MySQL.

## (Bonus) Installing phpMyAdmin

### Setting Up Host

We want to be able to lunch phpMyAdmin by going to
[http://phpmyadmin/](http://phpmyadmin/ 'phpMyAdmin') in the address bar of
the browser.

So, first of all, run:

```shell
sudo gedit /etc/hosts
```

And add entries as follows:

```shell
...

127.0.0.1   phpmyadmin
::1         phpmyadmin

...
```

### phpMyAdmin

Since the official repository has older version, we will pull the latest one
directly from the GitHub.

But before that, let's prepare ourselves better. We need to have `composer`
installed.

```shell
wget https://raw.githubusercontent.com/composer/getcomposer.org/1b137f8bf6db3e79a38a5bc45324414a6b1f9df2/web/installer -O - -q | php -- --quiet
sudo mv composer.phar /usr/bin/composer
composer config --global repo.packagist composer https://packagist.org
```

Now, let's clone the the official repository from GitHub.

_The repository is huge (~0.5 GB), so it may take a while for the download to
complete and the deltas to be resolved._

```shell
git clone https://github.com/phpmyadmin/phpmyadmin.git && cd phpmyadmin
git checkout STABLE
composer update --no-dev --prefer-dist
```

The phpMyAdmin needs to have some initial configurations to work properly. Run
the following in the shell while still being in the `phpmyadmin` directory.

```shell
mkdir tmp && chmod 777 tmp
touch config.inc.php
gedit config.inc.php
```

And paste the following code in it and save it.

```php
<?php
    // use here a value of your choice at least 32 chars long
    $cfg['blowfish_secret'] = '1{dd0`<Q),5XP_:R9UK%%8\"EEcyH#{o';

    $i=0;
    $i++;
    $cfg['Servers'][$i]['auth_type']     = 'cookie';
```

But before we go and setup the server-block for phpMyAdmin, let's be aware
that, at the time of this writing, php drivers are not able to connect to MySQL
8 with new authentication method called `caching_sha2_password`. Hence, we need
to change default authentication method to `mysql_native_password`. In the
shell, run:

```shell
mysql -u root -p
# enter your mysql root password here
```

You will be logged in the SQL console. Then write:

```sql
ALTER USER 'root'@'localhost' identified with mysql_native_password by 'root';
EXIT;
```

Notice above that in addition to the authentication method for the user `root`,
the password has also been changed to `root`. Also change the default from the
mysql config.

```shell
sudo gedit /etc/mysql/mysql.conf.d/mysqld.cnf
```

And add `default-authentication-plugin=mysql_native_password` just below the
line that says `[mysqld]`, like so:

```ini
...
[mysqld]
default-authentication-plugin=mysql_native_password
...
```

Restart the MySQL server.

```shell
sudo systemctl restart mysql.service
```

### Setting Up Server Block

Now, we will setup an **Nginx server block** (a.k.a. virtual host in Apache
httpd).

Let's run the following command to create a **site** (configuration file).

```shell
sudo touch /etc/nginx/conf.d/phpmyadmin.conf
```

Let's open it with:

```shell
sudo gedit /etc/nginx/conf.d/phpmyadmin.conf
```

And add the contents as follows.

```nginx
server {
    listen 80;
    listen [::]:80;

    root /home/[username]/phpmyadmin; # make sure to enter the correct location of phpmyadmin here
    index index.php index.html index.htm;

    server_name phpmyadmin; # as defined in the '/etc/hosts'

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        try_files $uri /index.php =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php7.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Activating the server block

Now we have to restart Nginx to activate our new site (config file) by running:

```shell
sudo systemctl restart nginx.service
```

Try hitting [http://phpmyadmin/](http://phpmyadmin/ 'phpMyAdmin') and it should
work! _(If you don't remember the username or password, try entering both of
them `root`.)_

## Conclusion

There we have it! We should by now have a working and relatively secure LEMP
server stack with Nginx running at
[http://localhost](http://localhost 'Localhost'), as well as our phpMyAdmin app
running at [http://phpmyadmin/](http://phpmyadmin/ 'phpMyAdmin')

_In this guide we didn't talk anything about firewall. This is because a fresh
install of "vanilla" Ubuntu 18.04 should not have one running it automatically.
We may research about it later if we wish to. Right now, that would be beyond
the scope of this guide._

So, did you find this guide helpful? Feedbacks are precious. Suggestions are
highly appreciated.
