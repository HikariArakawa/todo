import './globals.css';

export const metadata = {
  title: 'TODO App',
  description: 'A simple TODO app built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
