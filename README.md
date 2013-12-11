#Install is Debian Wheezy-specific, but it shouldn't be tough to modify.

##Install dependencies
  sudo apt-get update
  sudo apt-get install vim curl node git git-core psmisc ruby python-setuptools libfreetype6 libfontconfig1
  sudo apt-get install -y python-software-properties python g++ make
  gem update --system && gem install compass
  sudo easy_install awscli

##IP Tables if necessary
	sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
	sudo iptables -A INPUT -p tcp --dport ssh -j ACCEPT
	sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
	sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

##Set up bash environment
	cat to .bashrc >>
		#	Custom Environment
		if [ -f ~/.bash_aliases ]; then
		  source ~/.bash_aliases
		fi

		if [ -f ~/.node_env ]; then
		  source ~/.node_env
		fi

		# Displays the current git branch on the prompt
		source /home/admin/scripts/git-completion.bash

		RED="\[\033[0;31m\]"
		YELLOW="\[\033[0;33m\]"
		GREEN="\[\033[0;32m\]"
		NO_COLOUR="\[\033[0m\]"

		export PS1="∑ \W: "
		PS1="$BLUE\u$NO_COLOUR:\W$YELLOW\$(__git_ps1)$NO_COLOUR ∑: "

	cat to .bash_aliases >>
		alias ll='ls -al'
		alias gitclean='git ls-files --deleted | xargs git rm'
		alias reload='source ~/.bashrc'
		alias dev='cd ~/Development'
		alias quiver='cd ~/Development/quiver'
		alias quake='cd ~/Development/quake'
		alias sdk='cd ~/Development/quake-sdk'
		alias auth='cd ~/Development/quiver-auth'
		alias builder='cd ~/Development/quiver-build'
		alias apache='sudo /etc/init.d/apache2'
		alias mysql.server='sudo /etc/init.d/mysql'


	mkdir scripts
	curl -o scripts/git-completion.bash https://gist.github.com/deltaepsilon/dd696380e6aba899f258/raw/fba076dde27440eaa90fd4fcfdfa55764410dd11/git-completion.bash

	git config --global user.name "Christopher Esplin"
	git config --global user.email "chris@quiver.is"
	git config --global apply.whitespace nowarn
	git config --global core.autocrlf input
	git config --global alias.st status
	git config --global alias.ci commit
	git config --global alias.br branch
	git config --global alias.co checkout
	git config --global alias.df diff
	git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset | %cn | -%C(yellow)%d%Creset %s %Cgreen(%cr)%Creset' --abbrev-commit --date=relative" 
	git config --global color.diff auto
	git config --global color.status auto
	git config --global color.branch auto

	source ~/.bashrc

##Debian Wheezy Node Install https://sekati.com/etc/install-nodejs-on-debian-squeeze
	mkdir src
	cd src
	git clone https://github.com/joyent/node.git
	cd node
	# 'git tag' shows all available versions: select the latest stable.
	git checkout v0.10.10
	 
	# Configure seems not to find libssl by default so we give it an explicit pointer.
	# Optionally: you can isolate node by adding --prefix=/opt/node
	./configure --openssl-libpath=/usr/lib/ssl
	make
	make test
	sudo make install
	node -v # it's alive!
	 
	# Lucky us: NPM is packaged with Node.js source so this is now installed too
	# curl http://npmjs.org/install.sh | sudo sh
	npm -v # it's alive!
	

##Install MongoDB
	sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
	echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
	sudo apt-get update
	sudo apt-get install mongodb-10gen
	sudo mkdir /data
	sudo mkdir /data/db
	sudo chown -R admin:admin /data
	mongo #Make sure you get a mongo cli prompt. Try typing > show dbs;


##Install Redis http://redis.io/topics/quickstart
	cd ~/src
	wget http://download.redis.io/redis-stable.tar.gz
	tar xvzf redis-stable.tar.gz
	cd redis-stable
	make
	sudo cp src/redis-server /usr/local/bin/
	sudo cp src/redis-cli /usr/local/bin/

		sudo mkdir /etc/redis
		sudo mkdir /var/redis
		sudo cp utils/redis_init_script /etc/init.d/redis_6379
		sudo cp redis.conf /etc/redis/6379.conf
		sudo mkdir /var/redis/6379
		sudo vim /etc/redis/6379.conf
	#EDITS!!!
		Set daemonize to yes (by default it is set to no).
		Set the pidfile to /var/run/redis_6379.pid (modify the port if needed).
		Change the port accordingly. In our example it is not needed as the default port is already 6379.
		Set your preferred loglevel.
		Set the logfile to /var/log/redis_6379.log
		Set the dir to /var/redis/6379 (very important step!)
	sudo update-rc.d redis_6379 defaults
	sudo /etc/init.d/redis_6379 start
	redis-cli ping #Should answer PONG

##Test that Mongo and Redis are up after a reboot
	sudo reboot
	#Wait for reboot. SSH back in.
	redis-cli ping #Should PONG
	mongo #Should produce mongo prompt

##NPM Install all relevant globals
	sudo npm install -g forever grunt-cli pm2 bower phantomjs

##Install code
	vim ~/.node_env
	#Populate this .node_env. 
	#Make sure to add something like... export QUIVER_DEVELOPMENT_ROOT="/home/admin/Development"
	
	mkdir ~/Development
	cd ~/Development
	git clone git@github.com:deltaepsilon/quiver-build.git
	cd quiver-build
	npm install
	sh bin/githook #Start githook listener
	sh bin/build # Troubleshoot port openings for proxy.js: netstat -tnlp
	cd ~/Development/quiver
	bower install

##Verify Google+ API settings
	http://code.google.com/apis/console
	Update .node_env

##Notes
	quiver-build has a number of convenience scripts that can be helpful.
	bin/start - Starts up the main servers
	bin/githook - Starts up the githook server
	bin/stop - Stops all forever processes, including the servers and the githook listener
	bin/build - Clones or pulls all of the repos and starts up the servers. Does not start githook server, because the githook server needs to call this shell script for restarts, and it would end up restarting itself, which doesn't work so well.

## Copy up SSL files
	#Assuming that "ssh admin" will log you into the server... copy up the CSR, KEY and CRT files
	#~/.ssh/config should have an entry like...
	#	host admin
    #    	HostName 123.456.789.000
    #    	User admin
    #   	IdentityFile ~/.ssh/id_rsa

	scp STAR_quiver_is.crt admin:~/Development/quiver-build/ssl/STAR_quiver_is.crt
	scp myserver.key admin:~/Development/quiver-build/ssl/myserver.key
	scp server.csr admin:~/Development/quiver-build/ssl/server.csr


#Install LAMP

##Install Dependencies
	sudo apt-get install apache2 mysql-server php5 php-pear php5-mysql php-apc php-ssh2 php5-curl php5-intl zip unzip postfix

##Add mod_deflate
	sudo a2enmod deflate
	copy to end of apache2.conf:
	```
	# mod_deflate configuration
	<IfModule mod_deflate.c>
	 
	# Restrict compression to these MIME types
	AddOutputFilterByType DEFLATE text/plain
	AddOutputFilterByType DEFLATE text/html
	AddOutputFilterByType DEFLATE application/xhtml+xml
	AddOutputFilterByType DEFLATE text/xml
	AddOutputFilterByType DEFLATE application/xml
	AddOutputFilterByType DEFLATE application/x-javascript
	AddOutputFilterByType DEFLATE text/javascript
	AddOutputFilterByType DEFLATE text/css
	 
	# Level of compression (Highest 9 - Lowest 1)
	DeflateCompressionLevel 9
	 
	# Netscape 4.x has some problems.
	BrowserMatch ^Mozilla/4 gzip-only-text/html
	 
	# Netscape 4.06-4.08 have some more problems
	BrowserMatch ^Mozilla/4\.0[678] no-gzip
	 
	# MSIE masquerades as Netscape, but it is fine
	BrowserMatch \bMSI[E] !no-gzip !gzip-only-text/html
	 
	<IfModule mod_headers.c>
	# Make sure proxies don't deliver the wrong content
	Header append Vary User-Agent env=!dont-vary
	</IfModule>
	 
	</IfModule>

	FileETag none
	```

##Add mod_expires
	sudo a2enmod expires
	Copy to vhost or apache2.conf
	```
	#Expires
	AddType application/x-font-woff .woff
	AddType application/javascript .js
	AddType image/x-icon .ico
	
	ExpiresActive on
	ExpiresDefault "Access plus 1 year"
	ExpiresByType text/html "access plus 1 day"
	ExpiresByType application/json "access plus 1 seconds"
	ExpiresByType text/css "access plus 1 year"
	ExpiresByType image/png "access plus 1 year"
	ExpiresByType application/x-font-woff "access plus 1 year"
	ExpiresByType application/javascript "access plus 1 year"
	ExpiresByType text/javascript "access plus 1 year"
	ExpiresByType image/x-icon "access plus 1 year"

	```

##Configure MySQL
	mysql -u root
	CREATE USER 'chris'@'localhost' IDENTIFIED BY 'mypass';
	GRANT ALL ON *.* TO 'chris'@'localhost';
	exit;
	mysql -u chris -p
	create database calligraphy;
	create database chris_wordpress;
	create database isly_wordpress;

##Install NewRelic
	https://rpm.newrelic.com/accounts/330371/servers/get_started#platform=debian