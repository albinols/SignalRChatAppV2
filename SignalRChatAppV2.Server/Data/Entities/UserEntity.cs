using Microsoft.AspNetCore.Identity;

namespace SignalRChatAppV2.Server.Data.Entities
{
    public class UserEntity : IdentityUser
    {
        ICollection<MessageEntity> Messages { get; set; } = null!;
    }
}
