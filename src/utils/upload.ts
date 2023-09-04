import { supabase } from "./db";
import { promises as fs } from "fs";

const supabaseUpload = async (files) => {
  const fileUrls = [];

  for (let file of files.avatar) {
    try {
      const { data, error } = await supabase.storage
        .from("user-storage")
        .upload("profile-pictures/" + `avatar_${Date.now()}`, file);

      if (error) {
        console.error("Error uploading file:", error);
        continue;
      }

      const fileUrl = supabase.storage
        .from("user-storage")
        .getPublicUrl("profile-pictures/" + `avatar_${Date.now()}`);

      fileUrls.push(fileUrl.data.publicUrl);

      await fs.unlink(file.path);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  }
  return fileUrls;
};

export { supabaseUpload };
