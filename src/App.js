import './App.css';
import { useState } from 'react';
import imageCompression from 'browser-image-compression';
function App() {
  const [compressorFile, setCompressorFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [originalImageSize, setOriginalImageSize] = useState(undefined);
  const [compressedImageSize, setCompressedImageSize] = useState(undefined);

  const compressImage = async (inputFile, options) => {
    try {
      const compressedFile = await imageCompression(inputFile, options);
      // console.log('Compressed File:', compressedFile ); // clg the compressed file size
      setCompressorFile(compressedFile); // Set the compressed file in state
      setCompressedImageSize(compressedFile.size)
    } catch (error) {
      console.error('Image Compression Error:', error);
    }
  };

  const formatSize = (size) => {
    // Convert the size to a string and extract the first 4 digits
    const formattedSize = size/1024/1024;
    return formattedSize.toString().substring(0, 4);
  };

  const handleImageUpload = (event) => {
    const inputImage = event.target.files[0];
    const compressionOptions = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
    };

    if (inputImage) {
      compressImage(inputImage, compressionOptions);
      setOriginalImage(URL.createObjectURL(inputImage)); 
      setOriginalImageSize(inputImage.size)
    }
  };

  const handleDownload = () => {
    if (compressorFile) {
      // Create a URL for the compressed image file and a download link
      const url = URL.createObjectURL(compressorFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compressed_${compressorFile.name}`; // Set the desired file name
      link.click();
    }
  };

  return (
    <div className="App  bg-slate-300">
      <div className="container-fluid flex flex-col items-center  gap-2" >

        <h1 className="text-center text-2xl font-medium">Upload image here...</h1>
        
        <div className="flex justify-center ">
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            className='w-full border border-black rounded-lg'
            onChange={handleImageUpload} // Use onChange to trigger the image compression
          />
        </div>

        {originalImage ? (
        <div className='flex flex-col items-center'>
          <h2 className="text-2xl font-normal mt-4">Original Image Size: {formatSize(originalImageSize)}MB</h2>
          <img src={originalImage} className='w-2/3 border-4 rounded-xl border-white' alt="Original Image" />
        </div>
      ):<img src=''  alt='Upload to see Original image preview'></img>}

        {compressorFile ? (
          <div className='items-center flex flex-col gap-2'>
            <h2 className="text-xl mt-4 font-normal">Compressed Image Size: {formatSize(compressedImageSize)}MB</h2>
            <img src={URL.createObjectURL(compressorFile)} alt="Compressed Image" className='w-2/3 border-4 rounded-xl border-white' />
            <button 
              onClick={handleDownload}
              type="button" 
              className="px-4 py-3 bg-blue-600 rounded-md text-white outline-none focus:ring-4 shadow-lg transform active:scale-x-75 transition-transform mx-5 flex"
          >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>

              <span className="ml-2">Download</span>
            </button>
          </div>
        ):<img src='' alt='Upload to see compressed image preview'></img>}
      </div>
    </div>
  );
}

export default App;