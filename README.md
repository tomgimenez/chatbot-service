# E-Commerce Chatbot Service

![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/-rabbitmq-%23FF6600?style=flat&logo=rabbitmq&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-4DB33D?style=flat&logo=mongodb&logoColor=FFFFFF)
![Claude Anthropic](https://img.shields.io/badge/Claude%20Anthropic%20SDK-orange)

A sophisticated AI-powered chatbot microservice built for e-commerce platforms. This service leverages **Claude 3.5 Sonnet** from Anthropic to provide intelligent customer support with real-time product data integration. The service is designed to scale efficiently using **MongoDB** for conversation persistence and **RabbitMQ** for asynchronous message handling.

## Overview

This microservice acts as an intelligent conversational layer between customers and your e-commerce platform. It intelligently processes customer queries, fetches product information from your backend, and provides context-aware responses—all powered by Anthropic's Claude AI.

### Key Features

- 🤖 **AI-Powered Conversations** - Claude 3.5 Sonnet integration for natural language understanding
- 🔧 **Anthropic Tools Integration** - Dynamic tool calling to fetch real-time product data
- 💾 **Persistent Storage** - MongoDB for conversation history and context management
- 📬 **Event-Driven Architecture** - RabbitMQ for asynchronous message processing
- 🏥 **Health Monitoring** - Built-in health check endpoints for orchestration
- 🚀 **Containerized** - Docker and Docker Compose support for easy deployment
- 🌐 **RESTful API** - Express.js framework for HTTP endpoints

## Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js with TypeScript |
| **Framework** | Express.js |
| **AI Engine** | Anthropic Claude API |
| **Database** | MongoDB |
| **Message Queue** | RabbitMQ (AMQP) |
| **Containerization** | Docker & Docker Compose |

### System Design

```
Customer Request
    ↓
[Express API Endpoint]
    ↓
[Message Queue - RabbitMQ]
    ↓
[Message Consumer]
    ↓
[Claude Service] ← AI Processing
    ↓
[Anthropic Tools] → Backend API (Product Search, Product Details)
    ↓
[MongoDB] ← Conversation Storage
    ↓
Customer Response
```

## How It Works

### 1. Conversation Flow
- Users send messages to the API
- Messages are published to RabbitMQ for processing
- The consumer picks up messages and sends them to Claude
- Claude processes the query using available tools

### 2. Anthropic Tools System
The service implements **tool calling** - a powerful feature that allows Claude to autonomously call functions to retrieve data:

#### Available Tools:

**`search_products`** - Search for products across the e-commerce catalog
- Parameters:
  - `q` (string): Search query for product name/attributes
  - `category` (string): Filter by product category
  - `minPrice` (number): Minimum price filter
  - `maxPrice` (number): Maximum price filter
  - `limit` (number): Number of results (default: 5)

**`get_product`** - Retrieve detailed information for a specific product
- Parameters:
  - `slug` (string): Product slug identifier

When Claude determines it needs product data to answer a customer question, it automatically calls the appropriate tool, which fetches data from your NestJS backend API, and incorporates the results into its response.

### 3. Data Persistence
All conversations are stored in MongoDB with the following structure:
- Conversation ID
- User messages with timestamps
- Claude responses
- Tool usage history
- Metadata for analytics

## Project Structure

```
chatbot-service/
├── src/
│   ├── config/
│   │   ├── mongo.config.ts      # MongoDB connection setup
│   │   └── rabbitmq.config.ts   # RabbitMQ connection setup
│   ├── models/
│   │   └── conversation.model.ts # MongoDB conversation schema
│   ├── services/
│   │   ├── chat.service.ts      # Chat business logic
│   │   └── claude.service.ts    # Anthropic Claude integration
│   ├── consumers/
│   │   └── message.consumer.ts  # RabbitMQ message consumer
│   ├── publishers/
│   │   └── message.publisher.ts # RabbitMQ message publisher
│   ├── tools/
│   │   └── product.tools.ts     # Anthropic tool definitions
│   ├── routes/
│   │   └── health.route.ts      # Health check endpoints
│   └── index.ts                 # Application entry point
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Anthropic API Key
- NestJS Backend URL

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3001
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://mongo:27017/chatbot-service

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:5672

# Anthropic
ANTHROPIC_API_KEY=your_api_key_here

# Backend Service
NESTJS_URL=http://backend:3000
```

### Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Run in Development Mode**
   ```bash
   npm run dev
   ```
   The service will start with hot-reload enabled via `nodemon`

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Health Check
```
GET /health
```
Returns service status and connection information.

### Send Message
```
POST /chat
Content-Type: application/json

{
  "conversationId": "uuid",
  "message": "Do you have any blue sneakers under $100?"
}
```

## Running in Production

### Docker Deployment

The service is containerized and works seamlessly with Docker Compose:

```bash
docker-compose up -d --build
```

This starts:
- **Chatbot Service** on port 3001
- **MongoDB** for persistent storage
- **RabbitMQ** for message queuing

### Environment Configuration

Adjust the `docker-compose.yml` and environment variables for your production setup:
- Point `NESTJS_URL` to your actual backend service
- Configure `MONGO_URI` for production database
- Set `ANTHROPIC_API_KEY` with your production key

## Key Implementation Highlights

### Intelligent Tool Calling
The Claude service implements a loop that handles multiple tool calls within a single conversation turn, allowing Claude to:
1. Analyze customer questions
2. Decide which tools are needed
3. Call tools to fetch data
4. Incorporate results into a coherent response

### Asynchronous Processing
Using RabbitMQ ensures:
- **Decoupling**: Chat API and processing service operate independently
- **Scalability**: Multiple consumer instances can process messages in parallel
- **Reliability**: Message persistence prevents data loss

### Conversation Context
MongoDB stores complete conversation history, enabling:
- Multi-turn conversations with context awareness
- Analytics and insights from customer interactions
- Audit trails for customer service

## Development Workflow

### Available Scripts
```bash
npm run dev      # Start with hot-reload (development)
npm run build    # Compile TypeScript
npm start        # Run compiled service
npm test         # Run test suite
```

### Code Structure

- **Services**: Business logic for chat and Claude integration
- **Consumers**: Message queue subscribers that process incoming messages
- **Publishers**: Message queue publishers for outgoing messages
- **Tools**: Definitions for Anthropic tool calling
- **Models**: MongoDB schemas for data persistence
- **Config**: Connection setup for external services

## Monitoring & Debugging

- Check service health: `GET /health`
- View RabbitMQ management: `http://localhost:15672` (default credentials: guest/guest)
- Access MongoDB: Connection string in `.env`
- Logs: Check console output or configure logging middleware

## Future Enhancements

Potential improvements for production:
- [ ] Conversation analytics dashboard
- [ ] Multi-language support with automatic detection
- [ ] Custom model fine-tuning for domain-specific responses
- [ ] Rate limiting and request throttling
- [ ] Advanced caching for frequently accessed products
- [ ] Sentiment analysis for customer satisfaction
- [ ] Integration with customer support ticketing system

## Learning Outcomes

This project demonstrates:
- **Microservices Architecture** - Building scalable, independent services
- **AI Integration** - Leveraging modern AI APIs with tool calling
- **Event-Driven Systems** - Asynchronous processing with message queues
- **TypeScript Best Practices** - Type-safe backend development
- **Docker & Containerization** - Production-ready deployment
- **Database Design** - Schema design for conversation persistence

## License

ISC