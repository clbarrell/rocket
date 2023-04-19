import log from "./log";

export const sendBlobToApi = (
  blob: Blob,
  api: string,
  callback: (text: string) => void
): void => {
  // Determine the appropriate file type based on the Blob's MIME type
  let fileType = "";
  switch (blob.type) {
    case "audio/ogg":
      fileType = "mp3";
      break;
    case "audio/webm":
      fileType = "webm";
      break;
    // Add cases for other supported MIME types (mp4, mpeg, mpga, m4a, wav) if needed
    default:
      console.error("Unsupported audio format");
      return;
  }

  // Create a FormData object to send the Blob as the body of the fetch() request
  const formData = new FormData();
  formData.append("file", blob, `audio.${fileType}`);

  // Send the FormData as the body of the fetch() request
  fetch(api, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to upload audio file");
      }
      return response.json();
    })
    .then((data) => {
      // SPEAK
      callback(data.message);
    })
    .catch((error) => {
      console.error("Upload error:", error);
    });
};
