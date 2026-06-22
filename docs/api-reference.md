# WASITI 2027 — API Reference

## Base URL
http://localhost/api

## Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout

## Users
- GET /users/:id
- PUT /users/:id

## Companies
- POST /companies
- GET /companies
- GET /companies/:id

## Listings
- POST /listings
- GET /listings/search
- GET /listings/:id

## Chat
- WebSocket /chat

## Deals
- POST /deals
- GET /deals/:id
- PUT /deals/:id/transition