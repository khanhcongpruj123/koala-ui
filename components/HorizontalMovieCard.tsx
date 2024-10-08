import { PhotoIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'

type HorizontalMovieCardProps = {
  title?: string
  thumbUrl?: string
  rate?: number
  categories?: string[]
}

import { useState } from 'react' // Add this import

export function HorizontalMovieCard({
  title,
  thumbUrl,
  rate,
  categories,
}: HorizontalMovieCardProps) {
  const [isThumbError, setThumbError] = useState(false) // Add state for image error

  return (
    <div className="flex h-full w-full flex-shrink gap-2">
      <div className="w-1/2">
        <div className="relative top-0 h-full">
          {thumbUrl && !isThumbError && (
            <Image
              fill
              src={thumbUrl}
              alt={title || 'thumbnail'}
              className="rounded-md object-cover"
              onError={() => setThumbError(true)} // Set error state on image load failure
            />
          )}
          {(isThumbError || !thumbUrl) && (
            <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-400">
              <PhotoIcon className="size-8" />
            </div>
          )}
        </div>
      </div>
      <div className="w-1/2">
        <div className="font-bold text-white">{title}</div>
        <div className="flex flex-wrap items-center gap-2">
          <StarIcon className="size-4 text-yellow-400" />
          <div className="sm:text-sm">{rate}</div>
          <div> | </div>
          <div className="sm:text-sm">{categories?.at(0)}</div>
        </div>
      </div>
    </div>
  )
}
