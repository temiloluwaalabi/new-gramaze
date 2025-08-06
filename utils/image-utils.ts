export const getValidImageUrl = (path?: string): string => {
   if (!path) return "/default-avatar.png";
   if (path.startsWith("http")) return path;
   if (path.startsWith("/")) return path;
   return "/" + path; 
 };
 