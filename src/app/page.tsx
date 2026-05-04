import { ClientOnly } from '@/components/ClientOnly';
import HomeLanding from '@/components/HomeLanding';

export default function Home() {
  return (
    <ClientOnly>
      <HomeLanding />
    </ClientOnly>
  );
}
