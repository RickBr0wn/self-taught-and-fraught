---
title: Docker - cheat sheet
date: 2020-04-15 02:04:63
category: docker
draft: false
---

![](images/docker.jpg)

This is a just list of all of the docker commands that I've found useful whilst learning Docker:

## Docker Images

List Docker images:

```bash
docker images
```

Remove Docker image:

```bash
docker rmi <image_id>
docker image rm <image_id>
```

Create Docker image - requires a Dockerfile:

```bash
docker build -t <dockerhub_username>/<custom_docker_image_name> .
```

## Docker Containers

List Docker containers:

```bash
docker ps
docker container ls -a
```

Stop and remove Docker container:

```bash
docker stop <container_id>
docker rm <container_id>
```

Remove all stopped Docker containers:

```bash
docker container prune
```

Create Docker container (requirement: Docker image):

```bash
docker run --name <custom_container_name> -p <new_port>:<defined_port> -d <dockerhub_user
```

## Docker Compose

If development, build, run and keep running (e.g. service_id equals dev):

```bash
docker-compose build <service_id>
docker-compose up <service_id>
```

If testing, build and run once (e.g. service_id equals test):

```bash
docker-compose build <service_id>
docker-compose run --rm <service_id>
```

✏️ [Rick Brown](https://github.com/RickBr0wn)
📷[Tri Eptaroka Mardiana](https://unsplash.com/@inidiana?utm_source=unsplash)
