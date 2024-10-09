using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRChatAppV2.Server.Data.Contexts;
using SignalRChatAppV2.Server.Data.Entities;

namespace SignalRChatAppV2.Server.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ChatContext _context;

        public ChatHub(ChatContext context)
        {
            _context = context;
        }

        // Called when a new client connects to the hub.
        public override async Task OnConnectedAsync()
        {
            // Check if the user is authenticated before proceeding.
            if (Context.User?.Identity != null && Context.User.Identity.IsAuthenticated)
            {
                // Retrieve the last 30 chat messages from the database, including user information
                var messages = await _context.ChatMessages
                .Include(m => m.User)
                .OrderByDescending(m => m.Timestamp)
                .Take(30)
                .ToListAsync();

                // Send the messages to the connected client in chronological order.
                foreach (var message in messages.OrderBy(m => m.Timestamp))
                {
                    await Clients.Caller.SendAsync("ReceiveMessage", message.User.UserName, message.Message, message.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"));
                }

                await base.OnConnectedAsync();
            }
        }

        // Method that handles sending a message from a client.
        public async Task SendMessage(string message)
        {

            var userName = Context.User?.Identity?.Name;

            if (string.IsNullOrEmpty(userName))
            {
                throw new HubException("User is nog logged in.");
            }

            var userId = Context.UserIdentifier;

            if (string.IsNullOrEmpty(userId))
            {
                throw new HubException("User id not found.");
            }

            // Create a new MessageEntity to represent the chat message.
            var chatMessage = new MessageEntity
            {
                userId = userId,
                Message = message,
                Timestamp = DateTime.Now
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            // Broadcast the message to all connected clients.
            await Clients.All.SendAsync("ReceiveMessage", userName, message, chatMessage.Timestamp.ToString("yyyy-MM-dd HH:mm:ss"));
        }
    }
}
