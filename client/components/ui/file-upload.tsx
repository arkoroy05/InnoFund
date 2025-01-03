import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { Button } from "./button";
import { FilePlus2Icon, Trash2 } from "lucide-react";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const FileUpload = ({
  onChange,
  Form,
}: {
  onChange?: (files: File[]) => void;
  Form: any;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles) {
      const validFiles = Array.from(newFiles).filter(
        (file) =>
          file.size <= MAX_FILE_SIZE && ACCEPTED_FILE_TYPES.includes(file.type)
      );

      if (newFiles.length !== validFiles.length) {
        Form.setError("pdfs", {
          type: "manual",
          message: `Only files with the following types are allowed: ${ACCEPTED_FILE_TYPES.join(
            ", "
          )}, and file size should not exceed ${MAX_FILE_SIZE / (1024*1024)}MB.`,
        });
      }
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      onChange && onChange(validFiles);
      Form.setValue(
        "pdfs",
        validFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
      );
    }
  };
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    Form.setValue(
      "pdfs",
      files
        .filter((_, i) => i !== index)
        .map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
    );
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        whileHover="animate"
        className="pt-2 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center ">
          <div className="relative w-full max-w-xl mx-auto ">
            {files.length > 0 && (
              <>
                {files.map((file, idx) => (
                  <motion.div
                    key={"file" + idx}
                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                    className={cn(
                      "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-3 w-full mb-2 mx-auto rounded-md",
                      "shadow-sm"
                    )}
                  >
                    <div className="flex justify-between w-full items-center gap-4">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="text-sm ml-1 text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                      >
                        {file.name}
                      </motion.p>
                    </div>

                    <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                      >
                        <Button className="w-fit text-red-800 text-sm border bg-transparent hover:bg-neutral-800 px-2" onClick={() => removeFile(idx)}>
                          <Trash2></Trash2>
                        </Button>
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-lg px-2 py-1 w-fit border"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB{" \u2022 "}
                        {new Date(file.lastModified).toLocaleDateString()}
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                >
                  <Button
                    className="w-fit text-sm border bg-transparent hover:bg-neutral-800 px-2 text-white p-4 w-full py-5"
                    onClick={handleClick}
                  >
                    <FilePlus2Icon></FilePlus2Icon> Add File
                  </Button>
                </motion.div>
              </>
            )}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                onClick={handleClick}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}
            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-lime-500 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
