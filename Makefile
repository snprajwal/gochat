.PHONY: build run clean

build:
	@echo "Building docker image"
	docker build -t gochat .

run:
	@echo "Running docker image"
	docker run -p 8080:8080 gochat

clean:
	@echo "Cleaning docker image"
	docker image rm gochat
