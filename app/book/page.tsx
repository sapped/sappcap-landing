// app/book/page.tsx
import { redirect } from "next/navigation";

export default function BookPage() {
  // This function will run on the server when this page is requested
  redirect(
    "https://underwriting.sapp.capital"
  );

  // The below code won't run because redirect throws an error
  // but TypeScript expects a return value for the component
  return null;
}
