import { supabase } from "./db";
import { v4 as uuidv4 } from "uuid";

const supabaseUpload = async (files: any) => {
  const fileUrls = [];

  for (let file of files.avatar) {
    try {
      const { data, error } = await supabase.storage
        .from("user-storage")
        .upload("profile-pictures/" + `avatar_${uuidv4()}`, file.buffer, {
          contentType: file.mimetype,
        });
      if (error) {
        console.error("Error uploading file:", error);
        continue;
      }

      const fileUrl = supabase.storage
        .from("user-storage")
        .getPublicUrl(data.path);

      fileUrls.push(fileUrl.data.publicUrl);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  }
  return fileUrls;
};

export { supabaseUpload };
