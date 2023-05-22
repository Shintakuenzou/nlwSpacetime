"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";

export function MidiaPicker() {
  const [preview, setPreview] = useState<string | null>(null);

  function onMidiaSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    if (!files) {
      return;
    }

    const previewUrl = URL.createObjectURL(files[0]);
    setPreview(previewUrl);
  }

  return (
    <>
      <input
        onChange={onMidiaSelected}
        name="coverUrl"
        type="file"
        id="midia"
        accept="image/*"
        className="invisible h-0 w-0"
      />
      {preview && (
        <Image
          src={preview}
          width={100}
          height={100}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  );
}
