import { supabase } from "./db";
import fs from "fs/promises";

const supabaseUpload = async (files: any) => {
  const fileUrls = [];

  for (let file of files) {
    try {
      const { data, error } = await supabase.storage
        .from("user-storage/profile-pictures")
        .upload(`avatar_${Date.now()}`, files);

      if (error) {
        console.error("Supabase error: ", error.message);
        continue;
      }

      // บันทึก URL จากการอัปโหลด
      if (data) {
        //@ts-ignore
        fileUrls.push(data.Key);
      }
      await fs.unlink(file.path);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  return fileUrls;
};

export { supabaseUpload };
