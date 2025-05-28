// export const uploadPdfToCloudinary = async (file: File): Promise<string> => {
//   try {
//     // Convert File to Buffer for server-side upload
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Create form data for the upload
//     const formData = new FormData();
    
//     // Create a Blob from buffer for FormData
//     const blob = new Blob([buffer], { type: file.type });
//     formData.append('file', blob, file.name);
    
//     // Add upload preset
//     formData.append('upload_preset', 'meterials_upload');
    
//     // Add resource type for non-image files
//     formData.append('resource_type', 'raw');

//     // Specify the folder
//     formData.append('folder', 'textbook');

    
//     // Make upload request to Cloudinary
//     const response = await fetch(`https://api.cloudinary.com/v1_1/do9emnqcm/raw/upload`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`Upload failed: ${response.statusText}`);
//     }

//     const data = await response.json();

    
//     // Add this logging to see what's returned
//     console.log('Cloudinary response:', data);
//     console.log('Secure URL:', data.secure_url);
//     console.log('Public ID:', data.public_id);
    
//     // Return the URL of the uploaded PDF
//     return data.secure_url;
//   } catch (error) {
//     console.error('Error uploading PDF to Cloudinary:', error);
//     throw new Error('Failed to upload PDF');
//   }
// };

export const uploadPdfToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'meterials_upload');
    formData.append('resource_type', 'raw'); // Explicitly set resource type
    formData.append('folder', 'textbook');   // Optional: organize in folders
    
    // Use the raw endpoint
    const response = await fetch(`https://api.cloudinary.com/v1_1/do9emnqcm/raw/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary error:', errorText);
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw upload with options response:', data);
    
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading PDF to Cloudinary:', error);
    throw new Error('Failed to upload PDF');
  }
};




// // Function to get PDF URL with proper headers for viewing
// export const getPdfViewUrl = (cloudinaryUrl: string): string => {
//   // Add fl_attachment parameter to force proper content-type headers
//   const url = new URL(cloudinaryUrl);
//   const pathParts = url.pathname.split('/');
  
//   // Insert content-type parameter before the version
//   const versionIndex = pathParts.findIndex(part => part.startsWith('v'));
//   if (versionIndex > 0) {
//     pathParts.splice(versionIndex, 0, 'fl_content_type:application%2Fpdf');
//     url.pathname = pathParts.join('/');
//   }
  
//   return url.toString();
// };
