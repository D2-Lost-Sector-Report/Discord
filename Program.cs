namespace D2LS_Discord
{
    public class Program
    {
        public static void Main()
        {
            var builder = WebApplication.CreateBuilder();

            builder.Services.AddAuthorization();

            var app = builder.Build();

            app.UseAuthorization();

            app.MapGet("/health", () => Results.Ok());

            app.Run();
        }
    }
}