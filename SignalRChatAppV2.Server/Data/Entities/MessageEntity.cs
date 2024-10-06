namespace SignalRChatAppV2.Server.Data.Entities
{
    public class MessageEntity
    {
        public int Id { get; set; }
        public string Message { get; set; } = null!;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string userId { get; set; } = null!;
        public UserEntity User { get; set; } = null!;
    }
}
