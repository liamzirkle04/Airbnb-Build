"use client";

// import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useCallback, useRef, ChangeEvent } from "react";
import { TbPhotoPlus } from "react-icons/tb";

// Cloudinary commented out for now - using basic file input instead
// declare global {
//   var cloudinary: any;
// }

type Props = {
  onChange: (value: string) => void;
  value: string;
};

function ImageUpload({ onChange, value }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Create a local object URL for preview
        // In production, you'd upload this to a server/cloudinary
        const objectUrl = URL.createObjectURL(file);
        onChange(objectUrl);
      }
    },
    [onChange]
  );

  // Cloudinary version commented out
  // const handleCallback = useCallback(
  //   (result: any) => {
  //     onChange(result.info.secure_url);
  //   },
  //   [onchange]
  // );

  return (
    <>
      {/* Cloudinary version commented out */}
      {/* <CldUploadWidget
        onUpload={handleCallback}
        uploadPreset="cptcecyi"
        options={{
          maxFiles: 1,
        }}
      >
        {({ open }) => {
          return (
            <div
              onClick={() => open?.()}
              className=" relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
            >
              <TbPhotoPlus size={50} />
              <div className="font-semibold text-lg">Click to upload</div>
              {value && (
                <div className=" absolute inset-0 w-full h-full">
                  <Image
                    alt="uploade"
                    fill
                    style={{ objectFit: "cover" }}
                    src={value}
                  />
                </div>
              )}
            </div>
          );
        }}
      </CldUploadWidget> */}
      
      {/* Basic file input version */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className=" relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
      >
        <TbPhotoPlus size={50} />
        <div className="font-semibold text-lg">Click to upload</div>
        {value && (
          <div className=" absolute inset-0 w-full h-full">
            <Image
              alt="upload"
              fill
              style={{ objectFit: "cover" }}
              src={value}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ImageUpload;
