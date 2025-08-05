import Image from "next/image";
import React, { useState } from "react";

interface MedicalFilesDisplayProps {
  medicalFiles: string | null;
  className?: string;
}

const MedicalFilesDisplay: React.FC<MedicalFilesDisplayProps> = ({
  medicalFiles,
  className = "",
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Parse the JSON string to get file paths
  const parseFiles = (files: string | null): string[] => {
    if (!files) return [];

    try {
      const parsed = JSON.parse(files);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing medical files:", error);
      return [];
    }
  };

  const files = parseFiles(medicalFiles);
  const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

  const handleImageError = (filePath: string) => {
    setImageErrors((prev) => new Set([...prev, filePath]));
  };

  const getFileName = (filePath: string): string => {
    return (
      filePath.split("/").pop()?.split("_").slice(1).join("_") || "Medical File"
    );
  };

  if (!files.length) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No medical files uploaded
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="mb-3 text-lg font-semibold">Medical Files</h3>

      {/* Files Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file, index) => {
          const fullUrl = `${baseUrl}/${file}`;
          const hasError = imageErrors.has(file);

          return (
            <div
              key={index}
              className="rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative mb-2 aspect-square overflow-hidden rounded-md bg-gray-100">
                {!hasError ? (
                  <Image
                    src={fullUrl}
                    alt={`Medical file ${index + 1}`}
                    fill
                    className="cursor-pointer object-cover transition-opacity hover:opacity-90"
                    onClick={() => setSelectedImage(fullUrl)}
                    onError={() => handleImageError(file)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg
                        className="mx-auto mb-2 h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-xs">File not found</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {getFileName(file)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    File {index + 1} of {files.length}
                  </span>
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View Full Size
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div
          className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-full max-w-4xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={selectedImage}
              alt="Medical file preview"
              width={800}
              height={600}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalFilesDisplay;

// Usage example:
// <MedicalFilesDisplay
//   medicalFiles={userData.medical_file}
//   className="mt-6"
// />
// import Image from "next/image";
// import React, { useState } from "react";

// interface MedicalFilesDisplayProps {
//   medicalFiles: string | null;
//   className?: string;
// }

// const MedicalFilesDisplay: React.FC<MedicalFilesDisplayProps> = ({
//   medicalFiles,
//   className = "",
// }) => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
//   const [showAllFiles, setShowAllFiles] = useState<boolean>(false);

//   // Parse the JSON string to get file paths
//   const parseFiles = (files: string | null): string[] => {
//     if (!files) return [];

//     try {
//       const parsed = JSON.parse(files);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch (error) {
//       console.error("Error parsing medical files:", error);
//       return [];
//     }
//   };

//   const files = parseFiles(medicalFiles);
//   const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

//   const handleImageError = (filePath: string) => {
//     setImageErrors((prev) => new Set([...prev, filePath]));
//   };

//   const getFileName = (filePath: string): string => {
//     return (
//       filePath.split("/").pop()?.split("_").slice(1).join("_") || "Medical File"
//     );
//   };

//   if (!files.length) {
//     return (
//       <div className={`text-sm text-gray-500 ${className}`}>
//         No medical files uploaded
//       </div>
//     );
//   }

//   return (
//     <div className={className}>
//       <div className="mt-4 flex flex-wrap items-center gap-[12px]">
//         {files.slice(0, 3).map((file, index) => {
//           const fullUrl = `${baseUrl}/${file}`;
//           const hasError = imageErrors.has(file);

//           return (
//             <div key={index} className="relative">
//               {!hasError ? (
//                 <Image
//                   src={fullUrl}
//                   width={145}
//                   height={105}
//                   className="h-[105px] w-[145px] cursor-pointer rounded-[6px] object-cover transition-opacity hover:opacity-90"
//                   alt="attachment"
//                   onClick={() => setSelectedImage(fullUrl)}
//                   onError={() => handleImageError(file)}
//                 />
//               ) : (
//                 <div className="flex h-[105px] w-[145px] items-center justify-center rounded-[6px] bg-gray-100">
//                   <div className="text-center text-gray-400">
//                     <svg
//                       className="mx-auto mb-1 h-8 w-8"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                     <p className="text-xs">File not found</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         {/* Show +X overlay for additional files */}
//         {files.length > 3 && (
//           <div className="relative">
//             <Image
//               src={`${baseUrl}/${files[3]}`}
//               width={145}
//               height={105}
//               className="relative h-[105px] w-[145px] cursor-pointer rounded-[6px] object-cover"
//               alt="attachment"
//               onClick={() => setSelectedImage(`${baseUrl}/${files[3]}`)}
//               onError={() => handleImageError(files[3])}
//             />
//             <div
//               className="absolute top-0 left-0 z-20 flex size-full cursor-pointer items-center justify-center bg-[#CCCCCC33]"
//               onClick={() => setShowAllFiles(true)}
//             >
//               <h2 className="text-2xl font-semibold text-white">
//                 +{files.length - 3}
//               </h2>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Show all files modal */}
//       {showAllFiles && (
//         <div
//           className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
//           onClick={() => setShowAllFiles(false)}
//         >
//           <div className="max-h-full max-w-4xl overflow-auto rounded-lg bg-white p-6">
//             <div className="mb-4 flex items-center justify-between">
//               <h3 className="text-lg font-semibold">All Medical Files</h3>
//               <button
//                 onClick={() => setShowAllFiles(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <svg
//                   className="h-6 w-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
//               {files.map((file, index) => {
//                 const fullUrl = `${baseUrl}/${file}`;
//                 const hasError = imageErrors.has(file);

//                 return (
//                   <div key={index} className="relative">
//                     {!hasError ? (
//                       <div className="flex flex-col gap-2">
//                         <Image
//                           src={fullUrl}
//                           width={145}
//                           height={105}
//                           className="h-[105px] w-[145px] cursor-pointer rounded-[6px] object-cover transition-opacity hover:opacity-90"
//                           alt="attachment"
//                           onClick={() => {
//                             setSelectedImage(fullUrl);
//                             setShowAllFiles(false);
//                           }}
//                           onError={() => handleImageError(file)}
//                         />
//                         <div className="space-y-1">
//                           <p className="truncate text-sm font-medium text-gray-900">
//                             {getFileName(file)}
//                           </p>
//                           <div className="flex items-center justify-between">
//                             <span className="text-xs text-gray-500">
//                               File {index + 1} of {files.length}
//                             </span>
//                             <a
//                               href={fullUrl}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-xs text-blue-600 hover:text-blue-800"
//                             >
//                               View Full Size
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex h-[105px] w-[145px] items-center justify-center rounded-[6px] bg-gray-100">
//                         <div className="text-center text-gray-400">
//                           <svg
//                             className="mx-auto mb-1 h-8 w-8"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                             />
//                           </svg>
//                           <p className="text-xs">File not found</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal for enlarged image */}
//       {selectedImage && (
//         <div
//           className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
//           onClick={() => setSelectedImage(null)}
//         >
//           <div className="relative max-h-full max-w-4xl">
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//             <Image
//               src={selectedImage}
//               alt="Medical file preview"
//               width={800}
//               height={600}
//               className="max-h-full max-w-full object-contain"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MedicalFilesDisplay;

// // Usage example:
// // <MedicalFilesDisplay
// //   medicalFiles={userData.medical_file}
// //   className="mt-6"
// // />
