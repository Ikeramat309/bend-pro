import { useRouter } from 'expo-router';

import MultipleBendsScreen from '@/features/bend-multiple/ui/MultipleBendsScreen';
import { Routes, guideRoute } from '@/navigation';

export default function MultipleBendsRoute() {
  const router = useRouter();

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };
    if (safeRouter.canGoBack?.()) {
      router.back();
      return;
    }
    router.replace(Routes.bends);
  }

  return (
    <MultipleBendsScreen
      onBackPress={handleBackPress}
      onGuidePress={() => router.push(guideRoute('multipleBends'))}
    />
  );
}
