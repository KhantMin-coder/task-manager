"use client";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { CheckIcon, Loader2 } from "lucide-react";

import Image from "next/image";
import { defaultImages } from "@/constants/images";
import Link from "next/link";
import { FormErrors } from "./form-error";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Array<Record<string, any>>>([]);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setIsloading(true);
      try {
        const result = await unsplash.photos.getRandom({
          count: 9,
        });
        if (result && result.response) {
          const newImages = result.response as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          console.error("Failed To Grab Images");
        }
      } catch (err) {
        console.log(err);
        setImages(defaultImages);
      } finally {
        setIsloading(false);
      }
    };

    fetchImages();
  }, []);

  if (isloading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((img) => (
          <div
            key={img.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 tranistion bg-muted",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(img.id);
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selectedImageId === img.id}
              // defaultChecked
              onChange={() => {}}
              disabled={pending}
              value={`${img.id} | ${img.urls.thumb} | ${img.urls.full} | ${img.links.html}| ${img.user.name}`}
            />
            <Image
              alt="unsplash image"
              fill
              className="object-cover rounded-sm"
              src={img.urls.thumb}
            />
            {selectedImageId === img.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <CheckIcon className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={img.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/10"
            >
              {img.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
