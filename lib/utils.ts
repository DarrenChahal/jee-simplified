import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
//import { currentUser } from '@clerk/nextjs/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export async function getCurrentUserEmail() {
//   const user = await currentUser();

//   if (!user) return 'chahaldarren@gmail.com'; // chg to null when auth is implemented
//   if (!user.emailAddresses) {
//     return 'chahaldarren@gmail.com'; // remove after auth is implemented
//   }
//   return user.emailAddresses[0]?.emailAddress;
// }
