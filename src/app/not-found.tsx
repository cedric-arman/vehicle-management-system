import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-6xl font-bold text-destructive">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Oops! The page you are looking for does not exist.
      </p>
      <Link href="/dashboard" passHref>
        <Button className="mt-6">Go Back Home</Button>
      </Link>
    </div>
  );
}
