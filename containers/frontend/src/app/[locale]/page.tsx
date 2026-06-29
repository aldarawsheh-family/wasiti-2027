// src/app/[locale]/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/ar/public');
}