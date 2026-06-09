import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { IotApiHostProvider } from '@/contexts/IotApiHostContext';

export const metadata = {
  title: {
    default: 'Flood Monitoring System',
    template: '%s — Flood Monitoring System',
  },
  description: 'Sistem monitoring ketinggian air berbasis IoT secara real-time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-slate-950 text-white antialiased">
        <AuthProvider>
          <IotApiHostProvider>
            {children}
          </IotApiHostProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
