import { redirect } from 'next/navigation';

import { getUserData } from '@/actions/get-user-data';

export default async function Home() {
  const userData = await getUserData();

  if (!userData) return redirect('/auth');

  const leagueId = userData.workspaces?.[0];

  if (!leagueId) return redirect('/create-league');

  if (leagueId) return redirect(`/league/${leagueId}`);
}
