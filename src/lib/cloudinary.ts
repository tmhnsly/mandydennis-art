export function cloudinaryUrl(
  url: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  if (!url.includes("res.cloudinary.com")) return url;

  const { width, height, quality = 80 } = options;
  const transforms: string[] = [`q_${quality}`, "f_auto"];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push("c_limit");

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}

export function thumbnailUrl(url: string): string {
  return cloudinaryUrl(url, { width: 600 });
}

export function fullUrl(url: string): string {
  return cloudinaryUrl(url, { width: 1600 });
}
