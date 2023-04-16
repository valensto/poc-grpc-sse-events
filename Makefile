include config/dev/.env
export

NETWORKS="$(shell docker network ls)"
VOLUMES="$(shell docker volume ls)"
SUCCESS=[ done "\xE2\x9C\x94" ]

.PHONY: install
install:
	@echo [ install services... ]
	@bash ./scripts/install.sh
	@echo $(SUCCESS)

.PHONY: all
all: down
	@echo [ starting services... ]
	docker compose up
	@echo $(SUCCESS)

.PHONY: measurement
measurement:
	@echo [ starting measurement... ]
	@bash ./scripts/measurement.sh

.PHONY: down
down:
	@echo [ teardown all containers... ]
	docker-compose down
	@echo $(SUCCESS)

.PHONY: protoc
protoc:
	@echo [ compiling proto files... ]
	@rm -fr ./internal/shared/genproto
	@DOCKER_BUILDKIT=1 docker build --file docker/protoc/dockerfile --target output --output ./internal/shared/genproto .
	@echo $(SUCCESS)