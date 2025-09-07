                L-1

feat: initialize chat application with user authentication and chat functionality

- Added package.json to manage dependencies and scripts.
- Created server.js to set up the Express server and socket.io.
- Implemented user registration, login, and logout functionalities in auth.controller.js.
- Developed chat creation functionality in chat.controller.js.
- Established MongoDB connection in db.js.
- Created authentication middleware to protect routes.
- Defined user and chat models using Mongoose.
- Set up authentication routes for user actions.
- Created chat routes to handle chat-related requests.
- Configured Express app with necessary middleware.
- Initialized socket.io server for real-time communication.

                L-2

- Add socket authentication middleware and
- creating message model.
- update dependencies
- Integrating AI response generation
- Refactor chat history retrieval and AI response generation in socket server


                L-3

feat: add Pinecone integration for vector storage and retrieval

- Updated package.json and package-lock.json to include @pinecone-database/pinecone dependency.
- Implemented vectorization of user messages and AI responses in socket server.
- Created vector.service.js for managing Pinecone memory operations.
- Enhanced AI response generation with vector embeddings.