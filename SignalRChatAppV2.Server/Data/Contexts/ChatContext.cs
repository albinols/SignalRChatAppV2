using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SignalRChatAppV2.Server.Data.Entities;

namespace SignalRChatAppV2.Server.Data.Contexts
{
    public class ChatContext(DbContextOptions options) : IdentityDbContext<UserEntity>(options)
    {
        public virtual DbSet<MessageEntity> ChatMessages { get; set; }
    }
}
