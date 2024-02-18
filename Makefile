.PHONY : build run clean

full: build remove install

build:
	docker build auth/ -t auth-jsapp:latest 
	docker build userinfo/ -t user-jsapp:latest
	docker build course-list/ -t course-jsapp:latest 
	docker build taken-course/ -t taken-jsapp:latest
	docker build frontend/ -t main-jsapp:latest

install:
	docker-compose up -d

ps:
	docker-compose ps
	
remove:
	docker-compose down

restart:
	docker-compose restart