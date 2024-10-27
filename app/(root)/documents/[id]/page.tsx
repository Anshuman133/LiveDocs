
import CollabrativeRoom from '@/components/ui/CollabrativeRoom'
import { getDocument } from '@/lib/actions/room.actions';
import { getClerkUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const Document = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;  // Awaiting params here

  const clerkUser = await currentUser();

  if (!clerkUser) redirect('/sign-in');

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if(!room) redirect('/');

  const userIds = Object.keys(room.usersAccesses) ;

if (userIds.length === 0) {
  console.log('No user IDs found');
  return [];
}

const users = await getClerkUsers({ userIds });


const usersData = Array.isArray(users)
  ? users.map((user: User) => ({
      ...user,
      userType: room.usersAccesses[user.email]?.includes('room:write')
        ? 'editor'
        : 'viewer',
    }))
  : [];

const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write')
  ? 'editor'
  : 'viewer';
  return (
    <main className="flex w-full flex-col items-center justify-center max-h-screen">
      <CollabrativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  )}

export default Document
