##Install is Debian Wheezy-specific, but it shouldn't be tough to modify.

#Install dependencies
sudo apt-get install vim curl node git git-core psmisc

#Set up bash environment
	cat to .bashrc >>
		#	Custom Environment
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
		alias builder='cd ~/Development/quiver-builder'


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

#Debian Wheezy Node Install *************** https://sekati.com/etc/install-nodejs-on-debian-squeeze
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
	

#Install MongoDB
	sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
	echo 'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
	sudo apt-get update
	sudo apt-get install mongodb-10gen
	sudo mkdir /data
	sudo mkdir /data/db
	sudo chown -R admin:admin /data
	mongo #Make sure you get a mongo cli prompt. Try typing > show dbs;


#Install Redis http://redis.io/topics/quickstart
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

#Test that Mongo and Redis are up after a reboot
	sudo reboot
	#Wait for reboot. SSH back in.
	redis-cli ping #Should PONG
	mongo #Should produce mongo prompt

#NPM Install all relevant globals
	npm install -g forever grunt-cli

#Install code
	 mkdir ~/Development
	 cd ~/Development
	 git clone git@github.com:deltaepsilon/quiver-build.git
	 cd quiver-build
	 npm install
	 sh bin/githook #Start githook listener
	 sh bin/build # Troubleshoot port openings for proxy.js: netstat -tnlp

#Verify Google+ API settings
	http://code.google.com/apis/console

#Notes
	quiver-build has a number of convenience scripts that can be helpful.
	bin/start - Starts up the main servers
	bin/githook - Starts up the githook server
	bin/stop - Stops all forever processes, including the servers and the githook listener
	bin/build - Clones or pulls all of the repos and starts up the servers. Does not start githook server, because the githook server needs to call this shell script for restarts, and it would end up restarting itself, which doesn't work so well.