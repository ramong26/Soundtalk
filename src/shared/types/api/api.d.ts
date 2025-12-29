namespace User {
  type UserType = 'local' | 'spotify' | 'google';

  interface Profile {
    id: string;
    displayName: string;
    profileImageUrl?: string | null;
    userType: UserType;
  }
}
