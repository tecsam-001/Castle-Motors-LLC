import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: { successful: Array<{ uploadURL: string }> }) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760,
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedFiles = [];
      
      for (let i = 0; i < Math.min(files.length, maxNumberOfFiles); i++) {
        const file = files[i];
        if (file.size > maxFileSize) {
          console.error(`File ${file.name} is too large`);
          continue;
        }

        // Get upload parameters
        const { url } = await onGetUploadParameters();
        
        // Upload file
        const response = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (response.ok) {
          uploadedFiles.push({ uploadURL: url });
        }
      }

      onComplete?.({ successful: uploadedFiles });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Input
        type="file"
        multiple={maxNumberOfFiles > 1}
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
        id="file-upload"
      />
      <Button 
        type="button"
        onClick={() => document.getElementById('file-upload')?.click()}
        className={buttonClassName}
        disabled={isUploading}
        data-testid="button-upload-files"
      >
        {isUploading ? 'Uploading...' : children}
      </Button>
    </div>
  );
}