import WelcomePage from '@/views/Welcome';

export const metadata = {
  title: 'Flood Monitoring System',
  description: 'Pantau ketinggian air secara real-time langsung dari sensor IoT.',
};

export default function HomePage() {
  return <WelcomePage />;
}
