
# Testing Guide

## Overview

Testing is done using **Jest**, a popular JavaScript testing framework. This guide covers how to run unit tests, integration tests, and end-to-end tests.

## Test Framework

- **Framework**: Jest
- **Version**: 30.1.3

## Running Tests

### Unit & Integration Tests

Run tests for controllers and services:

```bash
pnpm test
```

This command runs all unit and integration tests for the application.

##  Prerequisites for E2E Tests

### Podman Running

Before running tests (especially E2E tests), ensure Podman is running:

```bash
podman machine start
```

### End-to-End (E2E) Tests

Run comprehensive end-to-end API tests:

```bash
pnpm test:e2e
```


### TestContainers

TestContainers will automatically spin up a PostgreSQL container with the following specifications:

- **Image**: `postgres:15-alpine`
- **Version**: PostgreSQL 15 (Alpine Linux)

The container is automatically managed by TestContainers and will be cleaned up after tests complete.

## Test Commands Summary

| Command | Purpose |
|---------|---------|
| `pnpm test` | Run unit and integration tests |
| `pnpm test:e2e` | Run end-to-end API tests |
| `pnpm jest --version` | Check Jest version |

## Tips

- Make sure all dependencies are installed before running tests: `pnpm install`
- Run `podman machine start` before running E2E tests
- Tests will create and destroy databases automatically via TestContainers