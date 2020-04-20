---
title: 'Docker: a cheat sheet'
date: 2020-04-15 02:04:63
category: docker
draft: false
---

![](images/docker.jpg)

This is a just list of all of the docker commands that I've found useful whilst learning Docker:

## Docker Images

A Docker Image is a template that can be turned into a Docker Container.

- A Docker Image is comprised of a series of layers. Each layer is a set of filesystem changes and has a unique identifier assigned to it upon its creation.
- A Docker Image contains all the data and meta-data needed to run the containers that are launched from the image.
- A Docker Image is immutable. It is a read-only template.

## Common CLI Commands

List Docker images:

```bash
docker images
```

Remove Docker image:

```bash
docker rmi <image_id>
```

Create Docker image - requires a Dockerfile:

```bash
docker build -t <dockerhub_username>/<custom_docker_image_name> .
```

Create a new image from a containers changes, pausing it temporarily if it is running:

```bash
docker commit <image_id>
```

Show the history of an image:

```bash
docker history <image_id>
```

Tag an image into a repository:

```bash
docker tag <image_id> <repository>
```

Import the contents of a tarball to create a filesystem image:

```bash
docker import
```

Exports a containers filesystem as a tar archive:

```bash
docker export
```

To search DockerHub for images:

```bash
docker search
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

Create Docker container - requires a Dockerfile:

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
