using Microsoft.AspNetCore.Identity;

namespace SignalRChatAppV2.Server.Data.Entities
{
    public class UserEntity : IdentityUser
    {
        public ICollection<MessageEntity> Messages { get; set; } = new List<MessageEntity>();
    }
}
