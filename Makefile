#all
docker-up: docker-down
	docker-compose up -d --build

docker-log: docker-down
	docker-compose up --build

docker-down:
	docker-compose stop
	docker-compose down

permission-755:
	sudo chmod -R 755 ./src/

permission-777:
	sudo chmod -R 777 ./src/

console:
	docker-compose run --user $(shell id -u):$(shell id -g)  node sh -c "/bin/bash"

dev:
	docker-compose run --user $(shell id -u):$(shell id -g)  node sh -c "npm run dev"

test: docker-up install
	docker-compose run --user $(shell id -u):$(shell id -g)  node sh -c "npm run test"

ddev: docker-up install dev


install:
	docker-compose run --user $(shell id -u):$(shell id -g)  node sh -c "npm i"

lint-check:
	docker-compose run --user $(shell id -u):$(shell id -g)  node sh -c "npm run lint-check"

lint-fix:
	docker-compose run --user $(shell id -u):$(shell id -g)  node sh -c "npm run lint-fix"

