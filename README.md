# ChatApp

This is a simple chat application built with React for the frontend, C# (ASP.NET Core) for the backend, and SignalR for real-time communication. It allows multiple users to connect and send messages in real-time.

## Features
- Real-time chat functionality using SignalR
- User authentication (login and signup)
- Messages are displayed to all connected users
- Basic encryption for message content
- HTTPS for secure communication using a self-signed certificate

## Running the Application Locally

### 1. Clone the Repository
git clone https://github.com/yourusername/ChatApp.git
cd ChatApp

### 2. Set Up the Backend 

### 2.1 Dependencies
Navigate to the server project directory and restore the dependencies

cd SignalRChatAppV2.Server

dotnet restore

### 2.2. Configure the Database
The application uses SQLite for the database. Update the connection string in appsettings.json if needed.

Run the following commands to create the database:

dotnet ef database update

### 2.3 Set Up HTTPS with a Self-Signed Certificate
To run the application with HTTPS locally, create a self-signed certificate:

dotnet dev-certs https --trust

### 3 Run backend
Start the backend server:

dotnet run

### 4 Set Up the Frontend (React)

### 4.1 Dependencies
Navigate to the React project directory:

cd ../SignalRChatApp.Client

Install the dependencies:

npm install

### 4.2 Run the Frontend
npm run dev

### 5 Access the Application
Open a web browser and navigate to http://localhost:3000 to access the chat application.
May have to adjust ports.

