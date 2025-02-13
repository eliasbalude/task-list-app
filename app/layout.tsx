import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Task master',
  description: 'task manager simplified',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        <footer className="mt-8 p-4 text-center text-gray-600">
          Proudly developed by{' '}
          <a
            href="https://eliasbalude.vercel.app/"
            className="text-blue-500 hover:text-blue-700"
          >
            Elias Balude
          </a>
        </footer>
      </body>
    </html>
  );
}
