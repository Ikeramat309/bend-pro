import { useRouter } from 'expo-router';

import ParallelOffsetScreen from '@/features/bend-parallel-offset/ui/ParallelOffsetScreen';
import { guideRoute } from '@/navigation';

export default function ParallelOffsetRoute() {
  const router = useRouter();

  return (
    <ParallelOffsetScreen
      onGuidePress={() => router.push(guideRoute('parallelOffset'))}
    />
  );
}
