import { supabase } from "./db";

// const deleteImage = async (oldImageUrl) => {
//   const fullUrl = oldImageUrl;
//   let result;

//   const parts = fullUrl.split(
//     "https://kewjjbauwpznfmeqbdpp.supabase.co/storage/v1/object/public/user-storage/room_images/"
//   );
//   if (parts.length === 2) {
//     result = parts[1];
//   } else {
//     console.error("Invalid URL format");
//     return; // หาก URL ไม่ถูกต้องให้หยุดการทำงาน
//   }

//   try {
//     const storageResponse = await supabase.storage
//       .from("user-storage/room_images")
//       .remove([result]);
//     if (storageResponse.error) {
//       console.error("Error deleting old profile image:", storageResponse.error);
//     } else {
//       console.log("Old profile image deleted successfully.");
//     }
//   } catch (error) {
//     console.error("Error deleting old profile image:", error.message);
//   }
// };

// export { deleteImage };

const deleteImage = async (oldImageUrls) => {
  for (const oldImageUrl of oldImageUrls) {
    try {
      const fullUrl = oldImageUrl;
      let result = [];

      const parts = fullUrl.split(
        "https://kewjjbauwpznfmeqbdpp.supabase.co/storage/v1/object/public/user-storage/"
      );
      if (parts.length === 2) {
        result = parts[1];
      } else {
        console.error("Invalid URL format");
        continue;
      }

      const storageResponse = await supabase.storage
        .from("user-storage")
        .remove(result);
      if (storageResponse.error) {
        console.error("Error deleting old room image:", storageResponse.error);
      } else {
        console.log("Old room image deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting old room image:", error.message);
    }
  }
};

export { deleteImage };
