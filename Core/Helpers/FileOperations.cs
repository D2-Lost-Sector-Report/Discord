namespace D2LS_Discord.Core.Helpers
{
    public static class FileOperations
    {
        public static void EnsureDirectoryExists(string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
        }
    }
}
